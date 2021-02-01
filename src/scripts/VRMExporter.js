import { BufferAttribute } from "three";

// WebGL(OpenGL)マクロ定数
const WEBGL_CONST = {
    ARRAY_BUFFER: 34962,
    ELEMENT_ARRAY_BUFFER: 34963,
    BYTE: 5120,
    UNSIGNED_BYTE: 5121,
    SHORT: 5122,
    UNSIGNED_SHORT: 5123,
    UNSIGNED_INT: 5125,
    FLOAT: 5126,
    LINEAR: 9729,
    REPEAT: 10497
};

const BLENDSHAPE_PREFIX = "blend_";

export default class VRMExporter {
    constructor() {}
    parse(scene, humanoid, vrmMeta, materials, blendShapeProxy, lookAt, springBone, onDone) {

        const exporterInfo = { // TODO: データがなくて取得できない
            generator: "UniGLTF-2.0.0",
            version: "2.0"
        };

        // TODO: name基準で重複除外 これでいいのか？
        const uniqueMaterials = materials.filter((material, index, self) => 
                                            self.findIndex(e => e.name === material.name) === index);
        const uniqueMaterialNames = uniqueMaterials.map(material => material.name);

        const icon = vrmMeta.texture ? vrmMeta.texture.image : null; // TODO: ない場合もある
        const images = uniqueMaterials.filter(material => material.map).map(material => material.map.image);
        const outputImage = images.concat(icon).map(_ => ({
            bufferView: -1,
            mimeType: "image\/png", // TODO: とりあえずpngをいれた
            name: "" // TODO:
        }));
        const outputSamplers = outputImage.map(_ =>({
            magFilter: WEBGL_CONST.LINEAR, // TODO: だいたいこれだった
            minFilter: WEBGL_CONST.LINEAR, // TODO: だいたいこれだった
            wrapS: WEBGL_CONST.REPEAT, // TODO: だいたいこれだったからとりあえず直打ちした
            wrapT: WEBGL_CONST.REPEAT // TODO: だいたいこれだった
        }));
        const outputTextures = outputImage.map((_, index) => ({
            sampler: index, // TODO: 全パターンでindexなのか不明
            source: index // TODO: 全パターンでindexなのか不明
        }));

        const outputMaterials = uniqueMaterials.map((material, index) => 
        ({
            alphaMode: "OPAQUE", // TODO:
            doubleSided: false, // TODO:
            extensions: {
                KHR_materials_unlit: {} // TODO:
            },
            name: material.name,
            pbrMetallicRoughness: {
                baseColorFactor: [
                    material.color.r,
                    material.color.g,
                    material.color.b,
                    1 // TODO:
                ],
                baseColorTexture: {
                    extensions: {
                        KHR_texture_transform: {
                            offset: [0, 0],
                            scale: [1, 1]
                        }
                    },
                    index: index, // TODO: とりあえずindexにした
                    texCoord: 0 // TODO:
                },
                metallicFactor: 0, // TODO:
                roughnessFactor: 0.9 // TODO:
            }
        }));

        const rootNode = scene.children.filter(child => child.children.length > 0 && child.children[0].type === "Bone")[0];
        const nodes = getNodes(rootNode);
        const nodeNames = nodes.map(node => node.name);
        const outputNodes = nodes.map(node => ({
            children: node.children.map(childNode => nodeNames.indexOf(childNode.name)),
            name: node.name,
            rotation: [
                node.quaternion.x,
                node.quaternion.y,
                node.quaternion.z,
                node.quaternion.w
            ],
            scale: [
                node.scale.x,
                node.scale.y,
                node.scale.z
            ],
            translation: [
                node.position.x,
                node.position.y,
                node.position.z
            ]
        }));

        const accessors = [];

        const meshes = scene.children.filter(child => child.type === "Group" || child.type === "SkinnedMesh");

        const meshDatas = [];
        meshes.forEach(object => {
            const mesh = object.type === "Group" ? object.children[0] : object;
            const attributes = mesh.geometry.attributes;
            meshDatas.push(new MeshData(attributes.position, WEBGL_CONST.FLOAT, "POSITION", "VEC3", mesh.name));
            meshDatas.push(new MeshData(attributes.normal, WEBGL_CONST.FLOAT, "NORMAL", "VEC3", mesh.name));
            meshDatas.push(new MeshData(attributes.uv, WEBGL_CONST.FLOAT, "UV", "VEC2", mesh.name));
            meshDatas.push(new MeshData(attributes.skinWeight, WEBGL_CONST.FLOAT, "SKIN_WEIGHT", "VEC4", mesh.name));
            meshDatas.push(new MeshData(attributes.skinIndex, WEBGL_CONST.UNSIGNED_SHORT, "SKIN_INDEX", "VEC4", mesh.name));

            const subMeshes = object.type === "Group" ? object.children : [object];
            subMeshes.forEach(subMesh => {
                meshDatas.push(new MeshData(subMesh.geometry.index, WEBGL_CONST.UNSIGNED_INT, "INDEX", "SCALAR", mesh.name, subMesh.name));
            });

            if (mesh.userData.targetNames) {
                mesh.userData.targetNames.forEach(targetName => {
                    meshDatas.push(new MeshData(attributes.position, WEBGL_CONST.FLOAT, "BLEND_POSITION", "VEC3", mesh.name, BLENDSHAPE_PREFIX + targetName)); // TODO: 本当はblendShapeの差分値をいれるのだが適当にいれている
                    meshDatas.push(new MeshData(attributes.normal, WEBGL_CONST.FLOAT, "BLEND_NORMAL", "VEC3", mesh.name, BLENDSHAPE_PREFIX + targetName)); // TODO: 本当はblendShapeの差分値をいれるのだが適当にいれている
                });
            }
        });

        // inverseBindMatrices length = 16(matrixの要素数) * 4バイト * ボーン数
        // TODO: とりあえず数合わせでrootNode以外のBoneのmatrixをいれた
        meshes.forEach(object => {
            const mesh = object.type === "Group" ? object.children[0] : object;
            const inverseBindMatrices = new Float32Array(mesh.skeleton.boneInverses.map(boneInv => boneInv.elements).flat());
            meshDatas.push(new MeshData(new BufferAttribute(inverseBindMatrices, 16), WEBGL_CONST.FLOAT, "BIND_MATRIX", "MAT4", mesh.name, mesh.name));
        })

        accessors.push(...meshDatas.map(meshData => ({
            bufferView: -1,
            byteOffset: 0,
            componentType: meshData.valueType,
            count: meshData.attribute.count,
            max: meshData.max,
            min: meshData.min,
            normalized: false,
            type: meshData.accessorsType
        })));

        const outputMeshes = meshes.map(object => {
            const mesh = object.type === "Group" ? object.children[0] : object;
            const subMeshes = object.type === "Group" ? object.children : [object];
            return {
                extras: {
                    targetNames: mesh.geometry.userData.targetNames,
                },
                name: mesh.name, // TODO: なんか違う名前になっている
                primitives: subMeshes.map(subMesh => {
                    const meshTypes = meshDatas.map(data => data.meshName === mesh.name ? data.type : null);
                    return {
                        attributes: {
                            JOINTS_0: meshTypes.indexOf("SKIN_INDEX"),
                            NORMAL: meshTypes.indexOf("NORMAL"),
                            POSITION: meshTypes.indexOf("POSITION"),
                            TEXCOORD_0: meshTypes.indexOf("UV"),
                            WEIGHTS_0: meshTypes.indexOf("SKIN_WEIGHT")
                        },
                        extras: {
                            targetNames: subMesh.geometry.userData.targetNames
                        },
                        indices: meshDatas.map(data => data.type === "INDEX" && data.meshName === mesh.name ? data.name : null).indexOf(subMesh.name),
                        material: uniqueMaterialNames.indexOf(subMesh.material[0].name),
                        mode: 4, // TRIANGLES
                        targets: subMesh.geometry.userData.targetNames ? subMesh.geometry.userData.targetNames.map(targetName => 
                        ({
                            NORMAL: meshDatas.map(data => data.type === "BLEND_NORMAL" && data.meshName === mesh.name ? data.name : null).indexOf(BLENDSHAPE_PREFIX + targetName),
                            POSITION: meshDatas.map(data => data.type === "BLEND_POSITION" && data.meshName === mesh.name ? data.name : null).indexOf(BLENDSHAPE_PREFIX + targetName)
                        })) : undefined
                    };
                })
            };
        });

        // mesh
        outputNodes.push(...meshes.map(group => ({
            mesh: 0, // TODO
            name: group.name,
            rotation: [
                group.quaternion.x,
                group.quaternion.y,
                group.quaternion.z,
                group.quaternion.w
            ],
            scale: [
                group.scale.x,
                group.scale.y,
                group.scale.z
            ],
            skin: 0, // TODO
            translation: [
                group.position.x,
                group.position.y,
                group.position.z
            ]
        })));

        // secondary
        const secondaryRootNode = scene.children.filter(child => child.type === "Object3D")[1]; // TODO: 取得方法を見直す必要がある
        outputNodes.push({
            name: secondaryRootNode.name,
            rotation: [
                secondaryRootNode.quaternion.x,
                secondaryRootNode.quaternion.y,
                secondaryRootNode.quaternion.z,
                secondaryRootNode.quaternion.w
            ],
            scale: [
                secondaryRootNode.scale.x,
                secondaryRootNode.scale.y,
                secondaryRootNode.scale.z
            ],
            translation: [
                secondaryRootNode.position.x,
                secondaryRootNode.position.y,
                secondaryRootNode.position.z
            ]
        });

        const outputSkins = meshes.map(object => {
            const mesh = object.type === "Group" ? object.children[0] : object;
            return {
                inverseBindMatrices: meshDatas.map(data => data.type === "BIND_MATRIX" ? data.meshName : null).indexOf(mesh.name),
                joints: mesh.skeleton.bones.map(bone => nodeNames.indexOf(bone.name)),
                skeleton: nodeNames.indexOf(mesh.skeleton.bones[0].name)
            }
        });

        const blendShapeMaster = {
            blendShapeGroups: Object.values(blendShapeProxy._blendShapeGroups).map(blendShape => 
                                ({
                                    binds: blendShape._binds.map(bind => 
                                    ({
                                        index: bind.morphTargetIndex,
                                        mesh: outputMeshes.map(mesh => mesh.name).indexOf(bind.meshes[0].name),
                                        weight: bind.weight * 100
                                    })),
                                    isBinary: blendShape.isBinary,
                                    materialValues: blendShape._materialValues,
                                    name: blendShape.name.replace("BlendShapeController_", ''),
                                    presetName: Object.entries(blendShapeProxy._blendShapePresetMap).filter(x => x[1] === blendShape.name.replace("BlendShapeController_", ''))[0][0]
                                }))
        };

        const exporterVersion = "UniVRM-0.64.0"; // TODO:

        lookAt.firstPerson._firstPersonBoneOffset.z *= -1; // TODO:
        const vrmFirstPerson = {
            firstPersonBone: nodeNames.indexOf(lookAt.firstPerson._firstPersonBone.name),
            firstPersonBoneOffset: lookAt.firstPerson._firstPersonBoneOffset,
            lookAtHorizontalInner: {
                curve:lookAt.applyer._curveHorizontalInner.curve,
                xRange: radian2Degree(lookAt.applyer._curveHorizontalInner.curveXRangeDegree),
                yRange: radian2Degree(lookAt.applyer._curveHorizontalInner.curveYRangeDegree)
            },
            lookAtHorizontalOuter: {
                curve:lookAt.applyer._curveHorizontalOuter.curve,
                xRange: radian2Degree(lookAt.applyer._curveHorizontalOuter.curveXRangeDegree),
                yRange: radian2Degree(lookAt.applyer._curveHorizontalOuter.curveYRangeDegree)
            },
            lookAtTypeName: lookAt.applyer.type,
            lookAtVerticalDown: {
                curve:lookAt.applyer._curveVerticalDown.curve,
                xRange: radian2Degree(lookAt.applyer._curveVerticalDown.curveXRangeDegree),
                yRange: radian2Degree(lookAt.applyer._curveVerticalDown.curveYRangeDegree)
            },
            lookAtVerticalUp: {
                curve:lookAt.applyer._curveVerticalUp.curve,
                xRange: radian2Degree(lookAt.applyer._curveVerticalUp.curveXRangeDegree),
                yRange: radian2Degree(lookAt.applyer._curveVerticalUp.curveYRangeDegree)
            },
            meshAnnotations: lookAt.firstPerson._meshAnnotations.map(annotation => ({
                firstPersonFlag: annotation.firstPersonFlag === 0 ? "Auto" : "", // TODO: 別の数字のとき何になるか
                mesh : outputMeshes.map(mesh => mesh.name).indexOf(annotation.mesh.children.length > 0 ? annotation.mesh.children[0].name : annotation.mesh.name) // TODO: とりあえず対応
            }))
        };

        const vrmHumanoid = {
            armStreatch: humanoid.humanDescription.armStretch,
            feetSpacing: humanoid.humanDescription.feetSpacing,
            hasTranslationDoF: humanoid.humanDescription.hasTranslationDoF,
            humanBones: Object.entries(humanoid.humanBones)
                            .filter(x => x[1].length > 0)
                            .map(x => ({
                                bone: x[0],
                                node: nodeNames.indexOf(x[1][0].node.name),
                                useDefaultValues: true // TODO:
                            })),
            legStretch: humanoid.humanDescription.legStretch,
            lowerArmTwist: humanoid.humanDescription.lowerArmTwist,
            lowerLegTwist: humanoid.humanDescription.lowerLegTwist,
            upperArmTwist: humanoid.humanDescription.upperArmTwist,
            upperLegTwist: humanoid.humanDescription.upperLegTwist
        };

        const materialProperties = materials.map((material) => material.userData.vrmMaterialProperties);
        
        vrmMeta.texture = outputImage.length - 1;
    
        const secondaryAnimation = {
            boneGroups: [
                {
                    bones: [], // TODO:
                    center: -1, // TODO:
                    colliderGroups: [], // TODO:
                    dragForce: 0.4, // TODO:
                    gravityDir: {
                        x: 0, // TODO:
                        y: -1, // TODO:
                        z: 0 // TODO:
                    },
                    gravityPower: 0, // TODO:
                    hitRadius: 0.02, // TODO:
                    stiffiness: 1 // TODO:
                }
            ],
            colliderGroups: springBone.colliderGroups
        };

        const bufferViews = [];
        bufferViews.push(...images.map(image => new BufferView(imageBitmap2png(image), "IMAGE")));
        bufferViews.push(...meshDatas.map(data => new BufferView(data.buffer, data.type)));
        if (icon) bufferViews.push(new BufferView(imageBitmap2png(icon), "IMAGE"));

        /* png画像として書き出しのテスト
        images.forEach((image, index) => {
            const fileName = "test"+index.toString()+".png";
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0);
            canvas.toBlob((blob) =>{
                console.log(blob);
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                // link.click();
            }, "image/png", 1.0);
        });
        */

        let bufferOffset = 0;
        let imageIndex = 0;
        let accessorIndex = 0;
        const outputBufferViews = bufferViews.map((bufferView, index) => {
            const value = {
                buffer: 0,
                byteLength: bufferView.buffer.byteLength,
                byteOffset: bufferOffset,
                target: bufferView.type === "IMAGE" || bufferView.type === "BIND_MATRIX" ? undefined :
                        bufferView.type === "INDEX" ? WEBGL_CONST.ELEMENT_ARRAY_BUFFER : WEBGL_CONST.ARRAY_BUFFER // TODO: だいたいこれだったの　Mesh/indicesだけELEMENT...           
            };
            bufferOffset += bufferView.buffer.byteLength;
            if (bufferView.type === "IMAGE") {
                outputImage[imageIndex++].bufferView = index;
            }
            else {
                accessors[accessorIndex++].bufferView = index;
            }
            return value;
        });

        const outputData = {
            accessors: accessors, // buffer数 - 画像数
            asset: exporterInfo, // TODO:
            buffers:[
                {
                    byteLength: bufferOffset
                }
            ],
            bufferViews: outputBufferViews, // accessors + images
            extensions:{
                VRM: {
                    blendShapeMaster: blendShapeMaster,
                    exporterVersion: exporterVersion,
                    firstPerson: vrmFirstPerson,
                    humanoid: vrmHumanoid,
                    materialProperties: materialProperties,
                    meta: vrmMeta,
                    secondaryAnimation: secondaryAnimation,
                    specVersion: "0.0" // TODO:
                }
            },
            extensionsUsed:[
                "KHR_materials_unlit", // TODO:
                "KHR_texture_transform", // TODO:
                "VRM"
            ],
            images: outputImage,
            materials: outputMaterials,
            meshes: outputMeshes,
            nodes: outputNodes,
            samplers: outputSamplers,
            scene: 0,
            scenes:[{nodes: [0, 90, 91]}], // TODO:
            skins: outputSkins,
            textures: outputTextures
        };
    
        const jsonChunk = new GlbChunk(parseString2Binary(JSON.stringify(outputData, undefined, 2)), "JSON");
        const binaryChunk = new GlbChunk(concatBinary(bufferViews.map(buf => buf.buffer)), "BIN\x00");
        const fileData = concatBinary([jsonChunk.buffer, binaryChunk.buffer]);
        const header = concatBinary([parseString2Binary("glTF"), parseNumber2Binary(2, 4), parseNumber2Binary(fileData.byteLength + 12, 4)]);
        onDone(concatBinary([header, fileData]));
    }
}

function radian2Degree(radian) {
    return radian * (180 / Math.PI);
}

function getNodes(parentNode) {
    if (parentNode.children.length <= 0) return parentNode;
    return [parentNode].concat(parentNode.children.map(child => getNodes(child)).flat());
}

function imageBitmap2png(image) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0);
    const pngUrl = canvas.toDataURL("image/png");
    const data = atob(pngUrl.split(',')[1]);
    const array = new ArrayBuffer(data.length);
    const view = new DataView(array);
    for (let i = 0; i < data.length; i++) {
        view.setUint8(i, data.charCodeAt(i));
    }
    return array;
}

function parseNumber2Binary(number, size) {
    const buf = new ArrayBuffer(size);
    const view = new DataView(buf);
    view.setUint32(0, number, true);
    return buf;
}

function parseString2Binary(str) {
    return new TextEncoder().encode(str).buffer;
}

function concatBinary(arrays) {
    let sumLength = 0;
    for (let i = 0; i < arrays.length; i++) {
        sumLength += arrays[i].byteLength;
    }
    const output = new Uint8Array(sumLength);
    let pos = 0;
    for (let i = 0; i < arrays.length; ++i) {
        output.set(new Uint8Array(arrays[i]), pos);
        pos += arrays[i].byteLength;
    }
    return output.buffer;
}

function parseBinary(attr, componentType) {

    const componentTypeSize = componentType === WEBGL_CONST.UNSIGNED_SHORT ? 2 : 4;
    const array = attr.array;
    let offset = 0;
    const buf = new ArrayBuffer(attr.count * attr.itemSize * componentTypeSize);
    const view = new DataView(buf);
    for (let i = 0; i < attr.count; i++) {
        for (var a = 0; a < attr.itemSize; a++) {

            let value;
            if (attr.itemSize > 4) {
                value = array[i * attr.itemSize + a];
            }
            else {
                if (a === 0) value = attr.getX(i);
                else if (a === 1) value = attr.getY(i);
                else if (a === 2) value = attr.getZ(i);
                else if (a === 3) value = attr.getW(i);
            }

            if (componentType === WEBGL_CONST.UNSIGNED_SHORT) {
                view.setUint16(offset, value, true);
            }
            else if (componentType === WEBGL_CONST.UNSIGNED_INT) {
                view.setUint32(offset, value, true);
            }
            else {
                view.setFloat32(offset, value, true);
            }
            offset += componentTypeSize;
        }

    }
    return buf;
}

class GlbChunk {
    constructor(data, type) {
        this.data = data;
        this.type = type;
        const buf = this.data;//, this.type === "JSON" ? 0x20 : 0x00);
        this.buffer = concatBinary([parseNumber2Binary(buf.byteLength, 4), parseString2Binary(this.type), buf]);
    }

    // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#structured-json-content
    paddingBinary(array, value) {
        const paddedLength = Math.ceil(array.byteLength / 4) * 4;
        if (array.byteLength === paddedLength) return array;
        const paddedArray = new Uint8Array(paddedLength);
        paddedArray.set(new Uint8Array(array), 0);
        for (let i = array.byteLength; i < paddedLength; i++) {
            paddedArray.set(new Uint8Array(value), i);
        }
        return paddedArray.buffer;
    }
}

class MeshData {
    constructor(attribute, valueType, type, accessorsType, meshName, name) {
        this.attribute = attribute;
        this.type = type;
        this.valueType = valueType;
        this.accessorsType = accessorsType;
        this.meshName = meshName;
        this.name = name;
        this.buffer = parseBinary(this.attribute, this.valueType);
        this.max = type === "POSITION" || type === "BLEND_POSITION" ? [
            Math.max.apply(null, this.attribute.array.filter((_, i) => i % 3 === 0)),
            Math.max.apply(null, this.attribute.array.filter((_, i) => i % 3 === 1)),
            Math.max.apply(null, this.attribute.array.filter((_, i) => i % 3 === 2))
        ] : undefined;
        this.min = type === "POSITION" || type === "BLEND_POSITION" ? [
            Math.min.apply(null, this.attribute.array.filter((_, i) => i % 3 === 0)),
            Math.min.apply(null, this.attribute.array.filter((_, i) => i % 3 === 1)),
            Math.min.apply(null, this.attribute.array.filter((_, i) => i % 3 === 2))
        ] : undefined;
    }
}

class BufferView {
    constructor(buffer, type) {
        this.buffer = buffer;
        this.type = type;
    }
}
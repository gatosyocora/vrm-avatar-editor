// WebGL(OpenGL)マクロ定数
const ARRAY_BUFFER = 34962;
const ELEMENT_ARRAY_BUFFER = 34963;

const UNSIGNED_SHORT = 5123;
const UNSIGNED_INT = 5125;
const FLOAT = 5126;

const LINEAR = 9729;
const REPEAT = 10497;


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

        const icon = vrmMeta.texture.image; // TODO: ない場合もある
        const images = uniqueMaterials.map(material => material.map.image);
        const outputImage = images.concat(icon).map(_ => ({
            bufferView: -1,
            mimeType: "image\/png", // TODO: とりあえずpngをいれた
            name: "" // TODO:
        }));
        const outputSamplers = outputImage.map(_ =>({
            magFilter: LINEAR, // TODO: だいたいこれだった
            minFilter: LINEAR, // TODO: だいたいこれだった
            wrapS: REPEAT, // TODO: だいたいこれだったからとりあえず直打ちした
            wrapT: REPEAT // TODO: だいたいこれだった
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
                node.quaternion._x,
                node.quaternion._y,
                node.quaternion._z,
                node.quaternion._w
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

        const meshes = scene.children.filter(child => child.type === "Group");

        const meshDatas = [];
        meshes.forEach(group => {
            const attributes = group.children[0].geometry.attributes;
            meshDatas.push(attributes.position.array);
            meshDatas.push(attributes.normal.array);
            meshDatas.push(attributes.uv.array);
            meshDatas.push(attributes.skinWeight.array);
            meshDatas.push(attributes.skinIndex.array);

            group.children.forEach(subMesh => {
                meshDatas.push(subMesh.geometry.index.array);
            });

            group.children[0].userData.targetNames.forEach(_ => {
                meshDatas.push(attributes.position.array); // TODO: 本当はblendShapeの差分値をいれるのだが適当にいれている
                meshDatas.push(attributes.normal.array); // TODO: 本当はblendShapeの差分値をいれるのだが適当にいれている
            });

            // position
            accessors.push({
                bufferView: -1,
                byteOffset: 0, // TODO: とりあえず0
                componentType: FLOAT,
                count: attributes.position.count,
                max: [
                    Math.max.apply(null, attributes.position.array.filter((_, i) => i % 3 === 0)),
                    Math.max.apply(null, attributes.position.array.filter((_, i) => i % 3 === 1)),
                    Math.max.apply(null, attributes.position.array.filter((_, i) => i % 3 === 2))
                ],
                min: [
                    Math.min.apply(null, attributes.position.array.filter((_, i) => i % 3 === 0)),
                    Math.min.apply(null, attributes.position.array.filter((_, i) => i % 3 === 1)),
                    Math.min.apply(null, attributes.position.array.filter((_, i) => i % 3 === 2))
                ],
                normalized: false,
                type: "VEC3"
            });

            // normal
            accessors.push({
                bufferView: -1,
                byteOffset: 0, // TODO: とりあえず0
                componentType: FLOAT,
                count: attributes.normal.count,
                normalized: false,
                type: "VEC3"
            });

            // uv
            accessors.push({
                bufferView: -1,
                byteOffset: 0, // TODO: とりあえず0
                componentType: FLOAT,
                count: attributes.uv.count,
                normalized: false,
                type: "VEC2"
            });

            // skinWeight
            accessors.push({
                bufferView: -1,
                byteOffset: 0, // TODO: とりあえず0
                componentType: FLOAT,
                count: attributes.skinWeight.count,
                normalized: false,
                type: "VEC4"
            });

            // skinIndex
            accessors.push({
                bufferView: -1,
                byteOffset: 0, // TODO: とりあえず0
                componentType: UNSIGNED_SHORT,
                count: attributes.skinWeight.count,
                normalized: false,
                type: "VEC4"
            });

            // index
            group.children.forEach(subMesh => {
                accessors.push({
                    bufferView: -1,
                    byteOffset: 0, // TODO: とりあえず0
                    componentType: UNSIGNED_INT,
                    count: subMesh.geometry.index.count,
                    normalized: false,
                    type: "SCALAR"
                });
            });

            // blendShape position, normal
            group.children[0].userData.targetNames.forEach(_ => {

                accessors.push({
                    bufferView: -1,
                    byteOffset: 0, // TODO: とりあえず0
                    componentType: FLOAT,
                    count: attributes.position.count,
                    max: [
                        Math.max.apply(null, attributes.position.array.filter((_, i) => i % 3 === 0)),　 // TODO: 本当はblendShapeの差分値をいれるのだが適当にいれている
                        Math.max.apply(null, attributes.position.array.filter((_, i) => i % 3 === 1)),　 // TODO: 本当はblendShapeの差分値をいれるのだが適当にいれている
                        Math.max.apply(null, attributes.position.array.filter((_, i) => i % 3 === 2))　 // TODO: 本当はblendShapeの差分値をいれるのだが適当にいれている
                    ],
                    min: [
                        Math.min.apply(null, attributes.position.array.filter((_, i) => i % 3 === 0)),　 // TODO: 本当はblendShapeの差分値をいれるのだが適当にいれている
                        Math.min.apply(null, attributes.position.array.filter((_, i) => i % 3 === 1)),　 // TODO: 本当はblendShapeの差分値をいれるのだが適当にいれている
                        Math.min.apply(null, attributes.position.array.filter((_, i) => i % 3 === 2))　 // TODO: 本当はblendShapeの差分値をいれるのだが適当にいれている
                    ],
                    normalized: false,
                    type: "VEC3"
                });

                accessors.push({
                    bufferView: -1,
                    byteOffset: 0, // TODO: とりあえず0
                    componentType: FLOAT,
                    count: attributes.normal.count,
                    normalized: false,
                    type: "VEC3"
                });
            });

        });

        // inverseBindMatrices length = 16(matrixの要素数) * 4バイト * ボーン数
        // TODO: とりあえず数合わせでrootNode以外のBoneのmatrixをいれた
        meshDatas.push(new Float32Array(nodes.filter((_, i) => i != 0).map(node => node.matrix.elements).flat()));
        accessors.push({
            bufferView: -1,
            byteOffset: 0,
            componentType: FLOAT,
            count: nodes.length - 1, // TODO: rootNodeを抜くから-1 ?
            normalized: false,
            type: "MAT4"
        });

        const outputMeshes = meshes.map(group => ({
                                    extras: {
                                        targetNames: group.children[0].geometry.userData.targetNames,
                                    },
                                    name: group.children[0].name, // TODO: なんか違う名前になっている
                                    primitives: group.children.map((subMesh, index) => ({
                                        attributes: {
                                            JOINTS_0: 4, // TODO: とりあえずこの数字 accessorsの添え字
                                            NORMAL: 1, // TODO: とりあえずこの数字 accessorsの添え字
                                            POSITION: 0, // TODO: とりあえずこの数字 accessorsの添え字
                                            TEXCOORD_0: 2, // TODO: とりあえずこの数字 accessorsの添え字
                                            WEIGHTS_0: 3 // TODO: とりあえずこの数字 accessorsの添え字
                                        },
                                        extras: {
                                            targetNames: subMesh.geometry.userData.targetNames
                                        },
                                        indices: 5 + index, // TODO: 5, 6
                                        material: uniqueMaterialNames.indexOf(subMesh.material[0].name),
                                        mode: 4, // TODO: とりあえず4にした
                                        targets: subMesh.geometry.userData.targetNames.map((_, i) => 
                                        ({
                                            NORMAL: 8 + i * 2, // TODO: accessorsの添え字
                                            POSITION: 7 + i * 2 // TODO: accessorsの添え字
                                        }))
                                    }))
                                }));

        // mesh
        outputNodes.push(meshes.map(group => ({
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

        const outputSkins = meshes.map(group => ({
                                    inverseBindMatrices: accessors.length - 1, // TODO: accessorsの最後に入っている
                                    joints: [...Array(nodes.length - 1)].map((_, i) => i + 1), // TODO: とりあえず1～89（ボーン数）の連番をつくった
                                    skeleton: 1 // TODO: とりあえず1にした
                                }));

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
                mesh : outputMeshes.map(mesh => mesh.name).indexOf(annotation.mesh.children[0].name) // TODO: とりあえず対応
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

        const buffers = [];
        const bufferViews = [];
        let bufferOffset = 0;
        buffers.push(...images.map(image => imageBitmap2png(image)));
        buffers.push(...meshDatas.map(data => float32Array2Binary(data)));
        if (icon) {
            buffers.push(imageBitmap2png(icon));
        }

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

        buffers.forEach((buffer, index) => {

            // bufferの最初は画像情報が入っている
            if (index < images.length) {
                bufferViews.push({
                    buffer: 0,
                    byteLength: buffer.length,
                    byteOffset: bufferOffset
                });

                outputImage[index].bufferView = index;
            }
            else if (index < images.length + accessors.length - 1){
                bufferViews.push({
                    buffer: 0,
                    byteLength: buffer.length,
                    byteOffset: bufferOffset,
                    target: index === 7 || index === 8 ? ELEMENT_ARRAY_BUFFER : ARRAY_BUFFER // TODO: だいたいこれだったの　Mesh/indicesだけELEMENT...
                });

                console.log(buffer.length);

                accessors[index - images.length].bufferView = index;
            }
            // inverseBindMatrices
            else if (index < images.length + accessors.length) {
                bufferViews.push({
                    buffer: 0,
                    byteLength: buffer.length,
                    byteOffset: bufferOffset
                });

                accessors[index - images.length].bufferView = index;            

            }
            // アイコン画像情報
            else {
                bufferViews.push({
                    buffer: 0,
                    byteLength: buffer.length,
                    byteOffset: bufferOffset
                });

                outputImage[outputImage.length - 1].bufferView = index;
            }
            bufferOffset += buffer.length;
        });

        const outputData = {
            accessors: accessors, // buffer数 - 画像数
            asset: exporterInfo, // TODO:
            buffers:[
                {
                    byteLength: bufferOffset
                }
            ],
            bufferViews: bufferViews, // accessors + images
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
    
        const jsonData = parseString2Binary(JSON.stringify(outputData, undefined, 2));
        const jsonSize = jsonData.length;
        const jsonChunk = new Uint8Array([
                            ...parseNumber2Binary(jsonSize, 4),
                            ...parseString2Binary("JSON")]);
        const bufferData = buffers.reduce((pre, current) => new Uint8Array([...pre, ...current])); // TODO: 時間がかかる
        const bufferChunk = new Uint8Array([
                                ...parseNumber2Binary(bufferData.length, 4),
                                ...parseString2Binary("BIN\x00")]);
        const fileData = new Uint8Array([
                                ...jsonChunk,
                                ...jsonData,
                                ...bufferChunk,
                                ...bufferData]);
        const fileSize = fileData.length;
        console.log(jsonSize);
        console.log(fileSize);
        const header = new Uint8Array([
                            ...parseString2Binary("glTF"),
                            ...parseNumber2Binary(2, 4),
                            ...parseNumber2Binary(fileSize, 4)]);
        onDone(new Uint8Array([...header, ...fileData]));
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
    const array = new Uint8Array(new ArrayBuffer(data.length));
    for (let i = 0; i < data.length; i++) {
        array[i] = data.charCodeAt(i);
    }
    return array;
}

function parseNumber2Binary(number, size) {
    const buf = new ArrayBuffer(size);
    const view = new DataView(buf);
    view.setInt32(0, number, true);
    return new Uint8Array(buf);
}

function float32Array2Binary(array) {
    return new Uint8Array(array.buffer);
}

function parseString2Binary(str) {
    return new TextEncoder().encode(str);
}
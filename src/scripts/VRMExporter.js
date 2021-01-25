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
    parse(scene, vrmMeta, materials, blendShapeProxy, lookAt, springBone, onDone) {

        const exporterInfo = { // データがなくて取得できない
            "generator": "UniGLTF-2.0.0",
            "version": "2.0"
        };

        // name基準で重複除外
        const uniqueMaterials = materials.filter((material, index, self) => 
                                            self.findIndex(e => e.name === material.name) === index);
        const uniqueMaterialNames = uniqueMaterials.map(material => material.name);

        const icon = null; // TODO vrmMeta.texture.image; ここにあると思ったけどここになかった
        const images = uniqueMaterials.map(material => material.map.image);
        const outputImage = images/*.concat(icon)*/.map(_ => ({ // データが無くなっているので復元できない
            "bufferView": -1,
            "mimeType": "image\/png", // TODO とりあえずpngをいれた
            "name": "" // TODO
        }));
        const outputSamplers = outputImage.map(_ =>({ // imagesに対応していることだけ分かっている
            "magFilter": LINEAR, // TODO だいたいこれだった
            "minFilter": LINEAR, // TODO だいたいこれだった
            "wrapS": REPEAT, // TODO だいたいこれだったからとりあえず直打ちした
            "wrapT": REPEAT // TODO だいたいこれだった
        }));
        const outputTextures = outputImage.map((_, index) => ({ // imagesに対応していることだけ分かっている
            "sampler": index, // TODO 全パターンでindexなのか不明
            "source": index // TODO 全パターンでindexなのか不明
        }));

        const outputMaterials = uniqueMaterials.map((material, index) => 
        ({
            "alphaMode": "OPAQUE", // TODO
            "doubleSided": false, // TODO
            "extensions": {
                "KHR_materials_unlit": {} // TODO
            },
            "name": material.name,
            "pbrMetallicRoughness": {
                "baseColorFactor": [
                    material.color.r,
                    material.color.g,
                    material.color.b,
                    1 // TODO
                ],
                "baseColorTexture": {
                    "extensions": {
                        "KHR_texture_transform": {
                            "offset": [0, 0],
                            "scale": [1, 1]
                        }
                    },
                    "index": index, // TODO とりあえずindexにした
                    "texCoord": 0 // TODO
                },
                "metallicFactor": 0, // TODO
                "roughnessFactor": 0.9 // TODO
            }
        }));

        const rootNode = scene.children.filter(child => child.children.length > 0 && child.children[0].type === "Bone")[0];
        const nodes = getNodes(rootNode).reverse();
        const nodeNames = nodes.map(node => node.name);
        const outputNodes = nodes.map(node => ({
            "children": node.children.map(childNode => nodeNames.indexOf(childNode.name)),
            "name": node.name,
            "rotation": [
                node.quaternion._x,
                node.quaternion._y,
                node.quaternion._z,
                node.quaternion._w
            ],
            "scale": [
                node.scale.x,
                node.scale.y,
                node.scale.z
            ],
            "translation": [
                node.position.x,
                node.position.y,
                node.position.z
            ]
        }));

        const meshes = scene.children.filter(child => child.type === "Group");

        const outputMeshes = meshes.map(group => ({
                                    "extras": {
                                        "targetNames": group.children[0].geometry.userData.targetNames,
                                    },
                                    "name": group.name, // TODO なんか違う名前になっている
                                    "primitives": group.children.map(subMesh => ({
                                        "attributes": {
                                            "JOINTS_0": 4, // TODO とりあえずこの数字
                                            "NORMAL": 1, // TODO とりあえずこの数字
                                            "POSITION": 0, // TODO とりあえずこの数字
                                            "TEXCOORD_0": 2, // TODO とりあえずこの数字
                                            "WEIGHTS_0": 3 // TODO とりあえずこの数字
                                        },
                                        "extras": {
                                            "targetNames": subMesh.geometry.userData.targetNames
                                        },
                                        "indices": -1, // TODO
                                        "material": uniqueMaterialNames.indexOf(subMesh.material[0].name),
                                        "mode": 4, // TODO とりあえず4にした
                                        "targets": [ // 12
                                            {
                                                "NORMAL": -1, // TODO
                                                "POSITION": -1 // TODO
                                            }
                                        ]
                                    }))
                                }));

        const outputSkins = meshes.map(group => ({
                                    "inverseBindMatrices": -1, // TODO
                                    "joints": [], // TODO
                                    "skeleton": 1 // TODO とりあえず1にした
                                }));

        const blendShapeMaster = {
            "blendShapeGroups": Object.values(blendShapeProxy._blendShapeGroups).map(blendShape => 
                                ({
                                    binds: blendShape._binds.map(bind => 
                                    ({
                                        index: bind.morphTargetIndex,
                                        mesh: outputMeshes.map(mesh => mesh.name).indexOf(bind.meshes[0].name), // TODO なんかおかしい
                                        weight: bind.weight * 100
                                    })),
                                    isBinary: blendShape.isBinary,
                                    materialValues: blendShape._materialValues,
                                    name: blendShape.name.replace("BlendShapeController_", ''),
                                    presetName: Object.entries(blendShapeProxy._blendShapePresetMap).filter(x => x[1] === blendShape.name.replace("BlendShapeController_", ''))[0][0]
                                }))
        };

        const exporterVersion = "UniVRM-0.64.0"; // TODO

        lookAt.firstPerson._firstPersonBoneOffset.z *= -1; // TODO
        const vrmFirstPerson = {
            "firstPersonBone": nodeNames.indexOf(lookAt.firstPerson._firstPersonBone.name),
            "firstPersonBoneOffset": lookAt.firstPerson._firstPersonBoneOffset,
            "lookAtHorizontalInner": {
                "curve":lookAt.applyer._curveHorizontalInner.curve,
                "xRange": radian2Degree(lookAt.applyer._curveHorizontalInner.curveXRangeDegree),
                "yRange": radian2Degree(lookAt.applyer._curveHorizontalInner.curveYRangeDegree)
            },
            "lookAtHorizontalOuter": {
                "curve":lookAt.applyer._curveHorizontalOuter.curve,
                "xRange": radian2Degree(lookAt.applyer._curveHorizontalOuter.curveXRangeDegree),
                "yRange": radian2Degree(lookAt.applyer._curveHorizontalOuter.curveYRangeDegree)
            },
            "lookAtTypeName": lookAt.applyer.type,
            "lookAtVerticalDown": {
                "curve":lookAt.applyer._curveVerticalDown.curve,
                "xRange": radian2Degree(lookAt.applyer._curveVerticalDown.curveXRangeDegree),
                "yRange": radian2Degree(lookAt.applyer._curveVerticalDown.curveYRangeDegree)
            },
            "lookAtVerticalUp": {
                "curve":lookAt.applyer._curveVerticalUp.curve,
                "xRange": radian2Degree(lookAt.applyer._curveVerticalUp.curveXRangeDegree),
                "yRange": radian2Degree(lookAt.applyer._curveVerticalUp.curveYRangeDegree)
            },
            "meshAnnotations": lookAt.firstPerson._meshAnnotations.map(annotation => ({
                "firstPersonFlag": annotation.firstPersonFlag === 0 ? "Auto" : "", // TODO 別の数字のとき何になるか
                "mesh" : outputMeshes.map(mesh => mesh.name).indexOf(annotation.mesh.name) // TODO とりあえず対応
            }))
        };

        const materialProperties = materials.map((material) => material.userData.vrmMaterialProperties);
        
        vrmMeta.texture = -1; // TODO データがなくなっているので復元不可で添え字なし
    
        const secondaryAnimation = {
            "boneGroups": [], // TODO
            "colliderGroups": springBone.colliderGroups
        };

        const accessors = [];

        let buffers = [];
        let bufferViews = [];
        let bufferOffset = 0;
        buffers.push(...images.map(image => imageBitmap2png(image)));
        //buffers.push()
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
                    "buffer": 0,
                    "byteLength": buffer.length,
                    "byteOffset": bufferOffset
                });

                outputImage[index].bufferView = index;
            }
            else if (index < images.length + accessors.length){
                bufferViews.push({
                    "buffer": 0,
                    "byteLength": buffer.length,
                    "byteOffset": bufferOffset,
                    "target": ARRAY_BUFFER // TODO だいたいこれだったの　34962, 34963
                });

                accessors[index - images.length].bufferView = index;
            }
            // アイコン画像情報
            else {
                bufferViews.push({
                    "buffer": 0,
                    "byteLength": buffer.length,
                    "byteOffset": bufferOffset
                });
            }
            
            bufferOffset += buffer.length;
        });

        const outputData = {
            "accessors": accessors, // 32 (buffer数 - 画像数)
            "asset": exporterInfo, // TODO
            "buffers":[
                {
                    "byteLength": bufferOffset
                }
            ],
            "bufferViews": bufferViews, // 35
            "extensions":{
                "VRM": {
                    "blendShapeMaster": blendShapeMaster,
                    "exporterVersion": exporterVersion,
                    "firstPerson": vrmFirstPerson,
                    "humanoid": {}, // TODO
                    "materialProperties": materialProperties,
                    "meta": vrmMeta,
                    "secondaryAnimation": secondaryAnimation,
                    "specVersion": "0.0" // TODO
                }
            },
            "extensionsUsed":[
                "KHR_materials_unlit", // TODO
                "KHR_texture_transform", // TOD
                "VRM"
            ],
            "images":　outputImage,
            "materials": outputMaterials,
            "meshes": outputMeshes,
            "nodes": outputNodes,
            "samplers": outputSamplers,
            "scene": 0,
            "scenes":[{"nodes": [0, 90, 91]}], // TODO
            "skins": outputSkins,
            "textures":　outputTextures
        };
    
        const header = "";
        onDone(header + JSON.stringify(outputData, undefined, 2) + buffers.join());
    }
}

function radian2Degree(radian) {
    return radian * (180 / Math.PI);
}

function getNodes(parentNode) {
    if (parentNode.children.length <= 0) return parentNode;
    return parentNode.children.map(child => getNodes(child)).concat(parentNode).flat();
}

function imageBitmap2png(image) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0);
    var pngUrl = canvas.toDataURL("image/png");
    return atob(pngUrl.split(',')[1]);
}
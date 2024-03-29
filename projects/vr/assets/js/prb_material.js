AFRAME.registerComponent('set_pbr', {
    dependencies: ['material'],
    schema: {type: 'string', default: 'default'},
    init: function () {
        this.el.addEventListener('materialtextureloaded', function (event) {
            if (event.detail.src.attributes['type'].value == 'src') {
                event.target.getObject3D('mesh').traverse(function (node) {
                    if (node.isMesh) {
                        node.material.alphaWrite = false;
                        node.material.map.encoding = THREE.sRGBEncoding;
                    }
                });
            }
        });

        let selector = '#'+this.data;
        this.el.setAttribute('material', {
            shader: 'standard',
            src: document.querySelector(selector+'_src'),
            normalMap: document.querySelector(selector+'_n'),
            ambientOcclusionMap: document.querySelector(selector+'_pbr'),
            metalnessMap: document.querySelector(selector+'_pbr'),
            roughnessMap: document.querySelector(selector+'_pbr'),
            metalness: 0.5,
            roughness: 1
        });
    }
});
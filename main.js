var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3.Black();
  console.log("New Scene created");

  const alpha = Math.PI / 4;
  const beta = Math.PI / 3;
  const radius = 500;//300;
  const target = new BABYLON.Vector3(0, 0, 0);

  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    alpha,
    beta,
    radius,
    target,
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  var light1 = new BABYLON.HemisphericLight(
    "hemiLight",
    new BABYLON.Vector3(-1, 1, 0),
    scene
  );
  light1.diffuse = new BABYLON.Color3(1, 1, 1);

  var light2 = new BABYLON.SpotLight(
    "spot02",
    new BABYLON.Vector3(200, 800, 300),
    new BABYLON.Vector3(-1, -2, -1),
    1.1,
    16,
    scene
  );
  light2.intensity = 0.99;

  var lightSphere2 = BABYLON.Mesh.CreateSphere("sphere", 200, 4, scene);
  lightSphere2.position = light2.position;
  lightSphere2.material = new BABYLON.StandardMaterial("light", scene);
  lightSphere2.material.emissiveColor = new BABYLON.Color3(
    0.8,
    0.86,
    0.89,
    0.55
  );

  var bigPlanet = BABYLON.Mesh.CreateIcoSphere(
    "sphere",
    { radius: 50, flat: true, subdivisions: 16 },
    scene
  );
  bigPlanet.position = new BABYLON.Vector3(-200, 1000, -500);
  bigPlanet.material = new BABYLON.StandardMaterial("light", scene);
  bigPlanet.material.emissiveColor = new BABYLON.Color3(0.93, 0.91, 0.11, 0.55);

  const skybox = BABYLON.Mesh.CreateIcoSphere(
    "sphere",
    { radius: 1900, flat: true, subdivisions: 16 },
    scene
  );

  const skyboxMaterial = new BABYLON.StandardMaterial("skyboxMat", scene);

  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.infiniteDistance = true;
  skyboxMaterial.alpha = 0.5;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  //texture of six sides
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1058/skybox",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;
  skybox.material = skyboxMaterial

  const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground", "textures/terrain22.png", {
    width: 4000, height: 4000, subdivisions: 250, maxHeight: 500, minHeight: 0
});
  const groundMaterial = new BABYLON.StandardMaterial("ground", scene);
  const snowTex = new BABYLON.Texture(
    "https://raw.githubusercontent.com/nicklvov/images/main/snow1.jpeg",
    scene
  );
  groundMaterial.diffuseTexture = snowTex 
  /*
  groundMaterial.diffuseTexture = new BABYLON.Texture(
    "https://raw.githubusercontent.com/nicklvov/images/main/snow1.jpeg",
    scene
  );
  */
  //groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
  groundMaterial.diffuseTexture.uScale = 6;
  groundMaterial.diffuseTexture.vScale = 6;
  groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  ground.material = groundMaterial;

  ////////////////////// objects on surface ///////////////////////
  const makePillar = function () {
    let paths = [];
    let y = 0;
    let h = 0.005;
    for (let i = 0; i < 100; i++) {
      const path = [];
      //let h = 1;
      for (let a = 0; a < 2 * Math.PI; a += Math.PI / 5) {
        //let x = Math.cos(a) +  0.5 * (Math.random() + 0.2) - i * h;
        //let z = Math.sin(a) +  0.5 * (Math.random() + 0.2) - i * h;
        let b = 5; //Math.random() + 0.01;
        let r = (1 - i * h) * b;
        let x = Math.cos(a) * r + 0.5 * (Math.random() + 0.2);
        let z = Math.sin(a) * r + 0.5 * (Math.random() + 0.2);
        path.push(new BABYLON.Vector3(x, y, z));
      }
      y = y + 1;
      path.push(path[0]); // close circle
      paths.push(path);
    }
    return paths;
  };

  const makePoleRnd = function (height, radius, nParts, nSides) {
    let paths = [];
    let y = 0;
    const dh = 20
    let h = height / nParts;
    for (let i = 0; i < nParts; i++) {
      const path = [];
      //let h = 1;
      for (let a = 0; a < 2 * Math.PI; a += 2 * Math.PI / nSides) {
        let r = radius + radius * (Math.random() - 0.5) / 2 
        r -= (i * h) / dh
        let x = Math.cos(a) * r + 0.5 * (Math.random() - 0.5);
        let z = Math.sin(a) * r + 0.5 * (Math.random() - 0.5);
        path.push(new BABYLON.Vector3(x, y, z));
      }
      y = y + h;
      path.push(path[0]); // close circle
      paths.push(path);
    }
    return paths;
  };

  const poleprofile = makePoleRnd(120,10,10,5)

  const pole = BABYLON.MeshBuilder.CreateRibbon("ribbon", {
    pathArray: poleprofile, //meshes,
    closePaths: true,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
  });
  pole.material = new BABYLON.StandardMaterial("");
  pole.material.diffuseTexture = snowTex;
  pole.translate(BABYLON.Axis.Y, 0, BABYLON.Space.WORLD);
  //pole.translate(BABYLON.Axis.Z, 50, BABYLON.Space.WORLD);
  
  const pillar = BABYLON.MeshBuilder.CreateRibbon("ribbon", {
    pathArray: makePillar(), //meshes,
    closePaths: true,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
  });
  

  pillar.material = new BABYLON.StandardMaterial("");
  pillar.material.diffuseTexture = snowTex;
  //pillar.material.wireframe = true;
  //pillar.translate(BABYLON.Axis.X, 25, BABYLON.Space.WORLD);
  pillar.translate(BABYLON.Axis.Y, 10, BABYLON.Space.WORLD);

  /*
  for (let i = 1; i <= 2; i++) {
    const stal = pillar.clone()
    stal.position.x = 1000 * Math.random() - 500
    stal.position.z = 1000 * Math.random() - 500
    stal.position.y = 50 * Math.random()
    stal.material.alpha = Math.random() + 0.5
    //stal.material.alpha = 0.5
  }
  */

  // Create a particle system
  var particleSystem = new BABYLON.ParticleSystem(
    "particles",
    6000,
    scene
  );
  //Texture of each particle
  
  particleSystem.particleTexture = new BABYLON.Texture(
    "textures/waterbump.png",
    scene
  );

  // Where the particles come from
  particleSystem.emitter = new BABYLON.Vector3(0, 100, 0); // the starting object, the emitter
  particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
  particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

  // Colors of all particles
  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

  // Size of each particle (random between...
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.8;

  // Life time of each particle (random between...
  particleSystem.minLifeTime = 2;
  particleSystem.maxLifeTime = 3.5;

  // Emission rate
  particleSystem.emitRate = 2000;

  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

  // Set the gravity of all particles
  particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

  // Direction of each particle after it has been emitted
  particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
  particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

  // Angular speed, in radians
  particleSystem.minAngularSpeed = 0;
  particleSystem.maxAngularSpeed = Math.PI;

  // Speed
  particleSystem.minEmitPower = 1;
  particleSystem.maxEmitPower = 4;
  particleSystem.updateSpeed = 0.025;

  // Start the particle system
  particleSystem.start();

  const newParticles = particleSystem.clone()
  newParticles.emitter = new BABYLON.Vector3(200, 20, 0);

  // Add vr()


  //////////////////////////////////////////
  const showAxis = function (size) {
    var makeTextPlane = function (text, color, size) {
      var dynamicTexture = new BABYLON.DynamicTexture(
        "DynamicTexture",
        50,
        scene,
        true
      );
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(
        text,
        5,
        40,
        "bold 36px Arial",
        color,
        "transparent",
        true
      );
      var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
      plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
      plane.material.backFaceCulling = false;
      plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
      plane.material.diffuseTexture = dynamicTexture;
      return plane;
    };

    var axisX = BABYLON.Mesh.CreateLines(
      "axisX",
      [
        new BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, -0.05 * size, 0),
      ],
      scene
    );
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines(
      "axisY",
      [
        new BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(0.05 * size, size * 0.95, 0),
      ],
      scene
    );
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines(
      "axisZ",
      [
        new BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, 0.05 * size, size * 0.95),
      ],
      scene
    );
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
  };

  //showAxis(300);
  /*
  const helper = scene.createDefaultXRExperience({createDeviceOrientationCamera: false})
  helper.enableInteractions()
  helper.enableTeleportation({floorMeshes: [ground]});
  */

  return scene;
};

var scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});

import 'vtk.js/Sources/favicon';

import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkHandleWidget from 'vtk.js/Sources/Interaction/Widgets/HandleWidget';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';

// Create some control UI
const container = document.querySelector('body');
const renderWindowContainer = document.createElement('div');
container.appendChild(renderWindowContainer);

// create what we will view
const renderWindow = vtkRenderWindow.newInstance();
const renderer = vtkRenderer.newInstance();
renderWindow.addRenderer(renderer);
renderer.setBackground(0.2, 0.2, 0.2);

const actor = vtkVolume.newInstance();

const mapper = vtkVolumeMapper.newInstance();
mapper.setSampleDistance(0.7);
actor.setMapper(mapper);

// now create something to view it, in this case webgl
const glwindow = vtkOpenGLRenderWindow.newInstance();
glwindow.setContainer(renderWindowContainer);
renderWindow.addView(glwindow);
glwindow.setSize(400, 400);

// Interactor
const interactor = vtkRenderWindowInteractor.newInstance();
interactor.setStillUpdateRate(0.01);
interactor.setView(glwindow);
interactor.initialize();
interactor.bindEvents(renderWindowContainer);
interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());

renderer.addVolume(actor);

// create color and opacity transfer functions
const ctfun = vtkColorTransferFunction.newInstance();
ctfun.addRGBPoint(0, 0.0, 0.5, 1.0);
ctfun.addRGBPoint(255.0, 1.0, 1.0, 0.0);
const ofun = vtkPiecewiseFunction.newInstance();
ofun.addPoint(0.0, 0.0);
ofun.addPoint(250.0, 0.2);
actor.getProperty().setRGBTransferFunction(0, ctfun);
actor.getProperty().setScalarOpacity(0, ofun);
actor.getProperty().setScalarOpacityUnitDistance(0, 3.0);
actor.getProperty().setComponentWeight(0, 1.0);
// actor.getProperty().setInterpolationTypeToLinear();

const ctfun2 = vtkColorTransferFunction.newInstance();
ctfun2.addRGBPoint(0, 1.0, 0, 0);
ctfun2.addRGBPoint(40, 0.0, 0.0, 1.0);
const ofun2 = vtkPiecewiseFunction.newInstance();
ofun2.addPoint(0.0, 0.0);
ofun2.addPoint(40.0, 0.1);
actor.getProperty().setRGBTransferFunction(1, ctfun2);
actor.getProperty().setScalarOpacity(1, ofun2);
actor.getProperty().setScalarOpacityUnitDistance(1, 0.5);
actor.getProperty().setComponentWeight(1, 1.0);

const ctfun3 = vtkColorTransferFunction.newInstance();
ctfun3.addRGBPoint(0, 0.0, 0, 0);
ctfun3.addRGBPoint(255, 1.0, 1.0, 1.0);
actor.getProperty().setRGBTransferFunction(2, ctfun2);
actor.getProperty().setScalarOpacity(2, ofun);
actor.getProperty().setScalarOpacityUnitDistance(2, 3.0);
actor.getProperty().setComponentWeight(2, 1.0);

const ctfun4 = vtkColorTransferFunction.newInstance();
ctfun4.addRGBPoint(0, 0.0, 0, 0);
ctfun4.addRGBPoint(255, 0.0, 1.0, 0.0);
actor.getProperty().setRGBTransferFunction(3, ctfun4);
actor.getProperty().setScalarOpacity(3, ofun);
actor.getProperty().setScalarOpacityUnitDistance(3, 3.0);
actor.getProperty().setComponentWeight(3, 1.0);

for (let nc = 0; nc < 4; ++nc) {
  actor.getProperty().setGradientOpacityMinimumValue(nc, 5.0);
  actor.getProperty().setGradientOpacityMaximumValue(nc, 10.0);
  actor.getProperty().setGradientOpacityMinimumOpacity(nc, 0.2);
  actor.getProperty().setGradientOpacityMaximumOpacity(nc, 1.0);
}

const lighting = 1;
const numComp = 4;
const independent = 1;
const withGO = 1;
let dataType = 0;

actor.getProperty().setShade(lighting);
actor.getProperty().setIndependentComponents(independent);

actor.getProperty().setUseGradientOpacity(0, withGO);
actor.getProperty().setUseGradientOpacity(1, withGO);
actor.getProperty().setUseGradientOpacity(2, withGO);
actor.getProperty().setUseGradientOpacity(3, withGO);

const xmin = -50;
const xmax = 49;
const ymin = -50;
const ymax = 49;
const zmin = -50;
const zmax = 49;

// create a synthetic volume with multiple components
const id = vtkImageData.newInstance();
id.setExtent(xmin, xmax, ymin, ymax, zmin, zmax);

let newArray;
dataType = (dataType + 1) % 3;
if (dataType === 0) {
  newArray = new Uint8Array(200 * 100 * 100 * numComp);
}
if (dataType === 1) {
  newArray = new Int16Array(200 * 100 * 100 * numComp);
}
if (dataType === 2) {
  newArray = new Float32Array(200 * 100 * 100 * numComp);
}

for (let c = 0; c < numComp - 1; ++c) {
  actor.getProperty().setComponentWeight(c, 0.2);
}
actor.getProperty().setComponentWeight(numComp - 1, 1.0);

let i = 0;
for (let z = zmin; z <= zmax; z++) {
  for (let y = ymin; y <= ymax; y++) {
    for (let x = xmin; x <= xmax; x++) {
      newArray[i] =
        40.0 *
        (3.0 + Math.cos(x / 20.0) + Math.cos(y / 10.0) + Math.cos(z / 5.0));
      if (numComp >= 2) {
        newArray[i + 1] = independent ? 0.2 * z : 1.25 * z;
      }
      if (numComp >= 3) {
        newArray[i + 2] = 125.0 * Math.cos(y / 10.0) + 128.0;
      }
      if (numComp >= 4) {
        newArray[i + 3] = 125.0 * Math.cos((x + z) / 15.0) + 128.0;
      }
      i += numComp;
    }
  }
}

const da = vtkDataArray.newInstance({
  numberOfComponents: numComp,
  values: newArray,
});
da.setName('scalars');

const cpd = id.getPointData();
cpd.setScalars(da);

mapper.setInputData(id);

console.log(
  `shade=${lighting} ind=${independent} comp=${numComp} GO=${withGO} type=${dataType}`
);

const widget = vtkHandleWidget.newInstance();

if (renderWindow.getInteractor() === interactor) {
  console.log('It is the same interactor');
} else {
  console.log('Oh hum, it is a different interactor');
}
widget.setInteractor(renderWindow.getInteractor());
widget.setEnabled(1);

renderer.resetCamera();
// renderer.getActiveCamera().setFocalPoint([0, 0, 0]);
// renderer.getActiveCamera().elevation(20);
// renderer.getActiveCamera().azimuth(1);
// renderer.resetCameraClippingRange();
renderWindow.render();

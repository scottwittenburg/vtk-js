import vtkActor                  from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkConeSource             from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkSphereSource           from 'vtk.js/Sources/Filters/Sources/SphereSource';
import vtkCubeSource             from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkMapper                 from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkRenderWindow           from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderer               from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

// Create some control UI
const container = document.querySelector('body');
const renderWindowContainer = document.createElement('div');
container.appendChild(renderWindowContainer);

// create what we will view
const renderWindow = vtkRenderWindow.newInstance();

// Upper renderer
const upperRenderer = vtkRenderer.newInstance();
upperRenderer.setViewport(0, 0.5, 1, 1); // xmin, ymin, xmax, ymax
renderWindow.addRenderer(upperRenderer);
upperRenderer.setBackground(0.5, 0, 0);

const coneActor = vtkActor.newInstance();
upperRenderer.addActor(coneActor);

const coneMapper = vtkMapper.newInstance();
coneActor.setMapper(coneMapper);

const coneSource = vtkConeSource.newInstance({ height: 1.0 });
coneMapper.setInputConnection(coneSource.getOutputPort());

// Lower left renderer
const lowerLeftRenderer = vtkRenderer.newInstance();
lowerLeftRenderer.setViewport(0, 0, 0.5, 0.5); // xmin, ymin, xmax, ymax
renderWindow.addRenderer(lowerLeftRenderer);
lowerLeftRenderer.setBackground(0, 0.5, 0);

const sphereActor = vtkActor.newInstance();
lowerLeftRenderer.addActor(sphereActor);

const sphereMapper = vtkMapper.newInstance();
sphereActor.setMapper(sphereMapper);

const sphereSource = vtkSphereSource.newInstance();
sphereMapper.setInputConnection(sphereSource.getOutputPort());

// Lower right renderer
const lowerRightRenderer = vtkRenderer.newInstance();
lowerRightRenderer.setViewport(0.5, 0, 1, 0.5); // xmin, ymin, xmax, ymax
renderWindow.addRenderer(lowerRightRenderer);
lowerRightRenderer.setBackground(0, 0, 0.5);

const cubeActor = vtkActor.newInstance();
lowerRightRenderer.addActor(cubeActor);

const cubeMapper = vtkMapper.newInstance();
cubeActor.setMapper(cubeMapper);

const cubeSource = vtkCubeSource.newInstance();
cubeMapper.setInputConnection(cubeSource.getOutputPort());

const glwindow = vtkOpenGLRenderWindow.newInstance();
glwindow.setContainer(renderWindowContainer);
renderWindow.addView(glwindow);
glwindow.setSize(400, 400);

upperRenderer.resetCamera();
lowerLeftRenderer.resetCamera();
lowerRightRenderer.resetCamera();

renderWindow.render();

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

// global.source = coneSource;
// global.mapper = mapper;
// global.actor = actor;
// global.renderer = renderer;
// global.renderWindow = renderWindow;

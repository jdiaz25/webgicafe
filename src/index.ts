import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    TonemapPlugin,
    ProgressivePlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,
    addBasePlugins,
   TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,
    IViewerPlugin,

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";
import gsap from "gsap"
import {ScrollTrigger} from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)


async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: false
    })

  
    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target


    // Add a popup(in HTML) with download progress when any asset is downloading.
    await viewer.addPlugin(AssetManagerBasicPopupPlugin)
    
   
    //await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
   
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
   
    await viewer.addPlugin(BloomPlugin)

    await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    await manager.addFromPath("./assets/cafe-nuevo2.glb")

    // Load an environment map if not set in the glb file
    // await viewer.scene.setEnvironment(
    //     await manager.importer!.importSinglePath<ITexture>(
    //         "./assets/environment.hdr"
    //     )
    // );

    // Add some UI for tweak and testing.
    const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // Add plugins to the UI to see their settings.
    uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)



    function setupScrollanimation(){
        const tl = gsap.timeline()

        //first section
        tl
        .to(position,{
            x: -5.05,
            y: 5.53,
            z: -8.30,
        
            scrollTrigger:{
                trigger: ".second",
                start: "0 bottom",
               
                end: "top top",
                scrub: 1,
                immediateRender: false
        },onUpdate})

        .to(".section--one--container",{
            opacity: 0,
            yPercent: '-150',
            scrollTrigger:{
                trigger: ".second",
                start: "top bottom",
                end: "top 80%",
                scrub: 1,
                immediateRender: false
        }})

        .to(".logo",{
            opacity: 1,
            y: 104,
            scrollTrigger:{
                trigger: ".second",
                start: "top bottom",
                
                end: "top 80%",
                scrub: 1,
                immediateRender: false
        }})


        .to(target,{
            x: -2.27,
            y: -0.29,
            z: 1.04,
        
            scrollTrigger:{
                trigger: ".second",
                start: "top bottom",
                
                end: "top top",
                scrub: 1,
                immediateRender: false
        }})


        .to(position,{
            x: 3.32,
            y: 4.47,
            z: 5.56,
        
            scrollTrigger:{
                trigger: ".third",
                start: "top bottom",
               
                end: "top top",
                scrub: 1,
                immediateRender: false
        },onUpdate})

        .to(".section--two--container",{
            opacity: 0,
            yPercent: '-150',
            scrollTrigger:{
                trigger: ".third",
                start: "top bottom",
                end: "top 80%",
                scrub: 1,
                immediateRender: false
        }})

        .to(target,{
            x: -2.14,
            y: 0.63,
            z: 0.17,
        
            scrollTrigger:{
                trigger: ".third",
                start: "top bottom",
                
                end: "top top",
                scrub: 1,
                immediateRender: false
        }})
       
    }

    setupScrollanimation()


    //WEBGI UPDATE

    let needsUpdate = true;

    function onUpdate(){
        needsUpdate = true
        viewer.renderer.resetShadows()
    }

    viewer.addEventListener('preFrame',()=>{
        if(needsUpdate){
            camera.positionUpdated(false)
            camera.targetUpdated(false)
            needsUpdate = false
        }
    })
}


setupViewer()

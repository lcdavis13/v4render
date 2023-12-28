import Feed from "@components/Feed";
import Link from "next/link";

const Home = () => (
    <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
            {/*Discover & Share*/}
            <br className="max-md:hidden"/>
            <span className="orange_gradient text-center">V4 Receptive Fields in 3D</span>
        </h1>
        <br className="max-md:hidden"/>
        <p className="desc text-left">

            Welcome to our interactive 3D visualization platform, inspired by findings from the study by Brad C. Motter, published in
            the Journal of Neuroscience in 2009. With this interactive visualization, we aim to explore the intricacies of visual field
            mapping within cortical regions, with a specific focus on the V4 area's neuronal receptive fields.
            We visualize Motter's findings that these neurons employ a unique, circular sampling  method from the primary visual cortex,
            bypassing additional magnification complexities. This interactive environment offers an in-depth exploration of visual
            information processing mechanisms in the brain, as uncovered in Motter's research.
        </p>
        <p className="desc text-left">
            Dive into this dynamic 3D environment for an insightful view into visual information processing in the
            brain.
        </p>
        <br/>
        <Link href="/visualization" passHref>
            <button style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <img width={"20%"} height={"20%"} src="/assets/images/rf3d_icon.png" alt="Start" />
                <h1><span style={{ marginTop: '10px', textAlign: 'center', fontSize: 'xx-large', fontWeight: 'bold', color: '#02579B'}}>Begin</span></h1>
            </button>
        </Link>




        <Feed/>
    </section>
);

export default Home;

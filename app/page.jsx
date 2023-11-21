import Feed from "@components/Feed";
import Link from "next/link";

const Home = () => (
  <section className="w-full flex-center flex-col">
    <h1 className="head_text text-center">
      Discover & Share
      <br className="max-md:hidden" />
      <span className="orange_gradient text-center">Receptive Fields 3D</span>
    </h1>
    <p className="desc text-center">
      Explore the fascinating world of neural networks with our "3D Receptive
      Fields Visualizer" app. Uncover the intricate patterns of neural activity
      by visualizing receptive fields in three-dimensional space. This
      cutting-edge tool allows users to dynamically interact with and comprehend
      how neurons respond to stimuli within a 3D environment.
    </p>
    <br />
    <Link href="/visualization" passHref>
      <button className="black_btn">Start Now!</button>
    </Link>

    <Feed />
  </section>
);

export default Home;

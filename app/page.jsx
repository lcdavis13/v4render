"use client";
import Brain2D from "@components/Brain2D";
import Brain3D from "@components/Brain3D";

const Home = () => (
  <section className='w-full flex-center flex-col'>
    <div class="bg-white">
    <div class="flex shadow mt-10 p-20">
      <div class="w-1/2">
        <Brain2D />
      </div>
      <div class="w-1/2">
        <Brain3D />
      </div>
    </div>
    </div>
  </section>
);

export default Home;

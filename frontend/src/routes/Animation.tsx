import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import CategoriesPage from '../components/pages/CategoriesPage';

export const Route = createFileRoute('/Animation')({
  component: RouteComponent,
})

const initialPublications = [
  {
    id: 1,
    image: 'https://media.istockphoto.com/id/1151510034/vector/seagull-flying-animation-sequence-cartoon-vector.webp?b=1&s=612x612&w=0&k=20&c=U6Ofyie33WY1vo_Q2VDgziH1dwc9e2hSJpXfef1clTg=',
    user_name: 'Artist 1',
    category: 'Animation',
    description: 'Description for publication 1',
    liked: false,
    likesCount: 0,
  },
  {
    id: 2,
    image: 'https://media.istockphoto.com/id/1156045856/vector/earth-globe-animate-spinning-vector-illustration.webp?b=1&s=612x612&w=0&k=20&c=-Kp8Zv8VKaXrZ-hggKLUfNuLpxnN-i402CgmWX7WO_M=',
    user_name: 'Artist 2',
    category: 'Animation',
    description: 'Description for publication 2',
    liked: false,
    likesCount: 0,
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/150',
    user_name: 'Artist 3',
    category: 'Animation',
    description: 'Description for publication 3',
    liked: false,
    likesCount: 0,
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/150',
    user_name: 'Artist 4',
    category: 'Animation',
    description: 'Description for publication 4',
    liked: false,
    likesCount: 0,
  },
  
];

function RouteComponent() {
  const [publications, setPublications] = useState(initialPublications);


  const handleLike = (id: number) => {
    setPublications((prev) =>
      prev.map((pub) =>
        pub.id === id ? { ...pub, liked: !pub.liked } : pub
      )
    );
  };

  const handleComment = (id: number) => {
    // 
  };

  return (
    <section className="min-h-screen bg-stone-950 p-10">
      <div className="flex items-center gap-3 mb-8">
        <img
          src="./public/icon-animacion.svg" 
          alt="animacion Icon"
          className="w-15 h-15 mt-2"
        />
        <span className="text-[#A39FF6] text-4xl font-bold">Animation</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {publications.map((pub) => (
          <CategoriesPage
            key={pub.id}
            publication={pub}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </section>
  );

}

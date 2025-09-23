import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import CategoriesPage from '../components/pages/CategoriesPage';

export const Route = createFileRoute('/Sculture')({
  component: RouteComponent,
})

const initialPublications = [
  {
    id: 1,
    image: 'https://cdn.pixabay.com/photo/2022/11/05/19/03/generated-7572592_1280.jpg',
    user_name: 'Artist 1',
    category: 'Sculture',
    description: 'Description for publication 1',
    liked: false,
    likesCount: 0,
  },
  {
    id: 2,
    image: 'https://cdn.pixabay.com/photo/2022/10/05/05/26/sculpture-7499732_1280.jpg',
    user_name: 'Artist 2',
    category: 'Sculture',
    description: 'Description for publication 2',
    liked: false,
    likesCount: 0,
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/150',
    user_name: 'Artist 3',
    category: 'Sculture',
    description: 'Description for publication 3',
    liked: false,
    likesCount: 0,
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/150',
    user_name: 'Artist 4',
    category: 'Sculture',
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
          src="./public/icon-sculture.svg" 
          alt="sculture Icon"
          className="w-15 h-15 mt-2"
        />
        <span className="text-[#96E2FF] text-4xl font-bold">Sculture</span>
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

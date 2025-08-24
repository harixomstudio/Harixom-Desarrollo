interface NavProps {
  list: string[];
  reference: string[];
}

export default function Nav(props: NavProps) {
  return (
    <section >
      <div className="flex items-center justify-between bg-gray-800 p-4">

        <div className='text-white text-3xl font-bold'>
          <a href="/Landing">Harixom</a>
        </div>

        <nav>
          <ul className="flex space-x-8">
            {props.list.map((list, i) => (
              <li>
                <a className="text-white" href={props.reference[i]}>
                  {list}
                </a>
              </li>
            ))};

            <li>
              <a
                className="text-black font-bold bg-[#F778BD] py-1 px-9 rounded-2xl border-rose-300 border-2"href="/Profile">Profile</a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}

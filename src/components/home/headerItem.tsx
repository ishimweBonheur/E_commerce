interface HeaderItemProps {
  item: {
    key: number;
    image: string;
    title: string;
    description: string;
  };
}

function Item({ item }: HeaderItemProps) {
  return (
    <div className="flex items-center gap-2" key={item.key}>
      <img src={item.image} alt={item.title} />
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold leading-none text-lg text-gray-700">
          {item.title}
        </h2>
        <span className="text-gray-400 text-sm">{item.description}</span>
      </div>
    </div>
  );
}

export default Item;

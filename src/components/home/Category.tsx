interface CategoryProps {
  icon: string;
  name: string;
}

export default function CategoryComponent({ icon, name }: CategoryProps) {
  return (
    <div className="flex gap-2 text-xl text-gray-600 tracking-wider hover:text-primary cursor-pointer">
      <img
        src={
          icon.startsWith('/') || icon.startsWith('https')
            ? icon
            : '/icons/categories.svg'
        }
        alt="icon"
        className="w-6 h-6"
      />
      <span>{name}</span>
    </div>
  );
}

type Pageprops = {
  direction: 'next' | 'previous';
  onClick: () => void;
};

function NextIcon(onClick: () => void) {
  return (
    <button type="button" onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.66699 12.9273L5.73972 14L11.7397 8L5.73972 2L4.66699 3.07273L9.59423 8L4.66699 12.9273Z"
          fill="#9095A1"
        />
      </svg>
      <span className="hidden">Next</span>
    </button>
  );
}

function PreviousIcon(onClick: () => void) {
  return (
    <button type="button" onClick={onClick}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0727 3.07273L10 2L4 8L10 14L11.0727 12.9273L6.14545 8L11.0727 3.07273Z"
          fill="#9095A1"
        />
      </svg>
      <span className="hidden">Prev</span>
    </button>
  );
}

export default function NavigationIcon({ direction, onClick }: Pageprops) {
  return direction === 'next' ? NextIcon(onClick) : PreviousIcon(onClick);
}

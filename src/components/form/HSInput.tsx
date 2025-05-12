interface MyInputProps {
  id?: string;
  name?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlurTextArea?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  values?: string | number;
  style?: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeTextArea?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: 'input' | 'textarea';
  text?: string;
  icon?: JSX.Element;
  maxLength?: number;
}

function HSInput({
  id,
  name,
  onBlur,
  onBlurTextArea,
  values,
  style,
  label,
  onChange,
  onChangeTextArea,
  onKeyDown,
  placeholder,
  type,
  text,
  icon,
  maxLength,
}: MyInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <label htmlFor={id} className="text-md font-medium">
        {label}
      </label>
      {type === 'input' ? (
        <div
          className={`${style} relative bg-grayLight text-black  duration-100 outline-none justify-between flex items-center gap-2 px-3 w-full rounded-md font-light  group-hover:border-grayDark`}
        >
          {icon && <p>{icon}</p>}
          <input
            type={text}
            value={values}
            onBlur={onBlur}
            id={id}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-full bg-transparent py-3 outline-none"
            maxLength={maxLength}
            onKeyDown={onKeyDown}
          />
        </div>
      ) : (
        <textarea
          id={id}
          name={name}
          onBlur={onBlurTextArea}
          cols={30}
          rows={6}
          placeholder={placeholder}
          onChange={onChangeTextArea}
          value={values}
          className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px] group-hover:border-grayDark px-5 py-3"
        />
      )}
    </div>
  );
}

export default HSInput;

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAutocomplete, AutocompleteGetTagProps } from '@mui/base/AutocompleteUnstyled';
import { styled } from '@mui/material/styles';

const Root = styled('div')(
  ({ theme }) => `
  color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'};
  font-size: 14px;
`
);

// const Label = styled('label')`
//   padding: 0 0 4px;
//   line-height: 1.5;
//   display: block;
// `;

const InputWrapper = styled('div')(
  ({ theme }) => `
  width: 300px;
  border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d9d9d9'};
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
  }
  
  &.focused {
    border-color: var(--main-green-color);
    box-shadow: rgba(53, 121, 96, 0.2) 0px 2px 8px 0px;
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'};
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

export default function AutoCompleteSearch({ tagStack }: { tagStack: any }) {
  const [myList, setMyList] = useState<string[]>([]);

  function Tag(props: TagProps) {
    const { label, onDelete, ...other } = props;
    function wrapperDelete() {
      onDelete('e');
    }
    return (
      <div {...other}>
        <span>{label}</span>
        <i onClick={wrapperDelete} className="bi bi-x"></i>
      </div>
    );
  }

  const StyledTag = styled(Tag)<TagProps>(
    ({ theme }) => `
    display: flex;
    align-items: center;
    height: 24px;
    margin: 2px;
    line-height: 22px;
    background-color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'};
    border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
    border-radius: 2px;
    box-sizing: content-box;
    padding: 0 4px 0 10px;
    outline: 0;
    overflow: hidden;

    &:focus {
      border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
      background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    }

    & span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    & svg {
      font-size: 12px;
      cursor: pointer;
      padding: 4px;
    }
  `
  );

  const Listbox = styled('ul')(
    ({ theme }) => `
    width: 300px;
    margin: 2px 0 0;
    padding: 0;
    position: absolute;
    list-style: none;
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    overflow: auto;
    max-height: 150px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100000;

    & li {
      padding: 5px 12px;
      display: flex;

      & span {
        flex-grow: 1;
      }

      & svg {
        color: transparent;
      }
    }

    & li[aria-selected='true'] {
      background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
      font-weight: 600;

      & svg {
        color: #1890ff;
      }
    }

    & li[data-focus='true'] {
      background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
      cursor: pointer;

      & svg {
        color: currentColor;
      }
    }
  `
  );

  const {
    getRootProps,
    // getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'categories',
    multiple: true,
    options: tags.slice(1),
    getOptionLabel: (option) => option.title,
  });

  useEffect(() => {
    tagStack.current = myList;
  }, [myList, tagStack]);

  useEffect(() => {
    const tagArray = [];
    for (let el of value) {
      tagArray.push(el.title);
    }
    setMyList(tagArray);
  }, [value])

  return (
    <Root>
      <div {...getRootProps()} className="auto-complete-search">
        <InputWrapper ref={setAnchorEl} className={`auto-complete-search ${focused ? 'focused' : ''}`}>
          {value.map((option: FilmOptionType, index: number) => {
            return <StyledTag label={option.title} {...getTagProps({ index })} />;
          })}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>

      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {(groupedOptions as typeof tags).map((option, index) => (
            <li {...getOptionProps({ option, index })}>
                <span>{option.title}</span>
                <i className="bi bi-check"></i>
            </li>
          ))}
        </Listbox>
      ) : null}
    </Root>
  );
}
interface FilmOptionType {
  title: string;
  // year: number;
}

const tags = [
  { title: 'All categories' },
  { title: 'Cars' },
  { title: 'Motorbikes' },
  { title: 'Motors & Accessories' },
  { title: 'Fashion & Accessories' },
  { title: 'Real Estate' },
  { title: 'Tv, Audio & Cameras' },
  { title: 'Cell Phones & Accessories' },
  { title: 'Computers & Electronic' },
  { title: 'Sports & Leisure' },
  { title: 'Bikes' },
  { title: 'Games & Consoles' },
  { title: 'Home & Garden' },
  { title: 'Appliances' },
  { title: 'Movies, Books & Music' },
  { title: 'Baby & Child' },
  { title: 'Collectibles & Arts' },
  { title: 'Construction' },
  { title: 'Agriculture & Industrial' },
  { title: 'Jobs' },
  { title: 'Services' },
  { title: 'Other' },
];

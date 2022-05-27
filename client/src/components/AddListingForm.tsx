import { useRef, useState, useEffect, FormEvent } from 'react';
import InputField from '../components/InputField';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiProvider';
import { useNavigate } from 'react-router-dom';
import '../styling/AddListingForm.scss';
import ButtonWide from '../components/ButtonWide';
import { FormSelect, Form } from 'react-bootstrap';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import FullScreenLoadingIndicator from '../components/FullScreenLoadingIndicator';
import AutoCompleteSearch from '../components/AutoCompleteSearch';
import { User } from '../interfaces/User';
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';

export default function AddListingForm() {
  const titleField = useRef<HTMLInputElement>(null);
  const descriptionField = useRef<HTMLInputElement>(null);
  const conditionField = useRef<HTMLSelectElement>(null);
  const priceField = useRef<HTMLInputElement>(null);
  const photoField = useRef<HTMLInputElement>(null);
  const user = useRef<User>();
  const [files, setFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const tags = useRef<string[]>(null);

  const handleFileSelect = (event: any): void => {
    setFiles(event.target.files);
  };

  const api = useApi();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const loadUserData = async () => {
        try {
          const res = await api.get(`/users/${currentUser.id}`);
          if (res.ok) {
            user.current = res.body.data.user;
          } else {
            console.log('failing to load user listing data');
            navigate('/');
            // handleErrors
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      loadUserData();
    } else {
      navigate('/');
    }
  }, [api, navigate, currentUser]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const title = titleField.current?.value;
    const description = descriptionField.current?.value;
    const condition = conditionField.current?.value;
    const price = priceField.current?.value;
    const errors: { [key: string]: string } = {};
    if (!title) {
      errors.title = 'Title is required';
    }
    if (!description) {
      errors.description = 'Description is required';
    }
    if (!price) {
      errors.price = 'Price is required';
    }
    if (files.length === 0) {
      errors.photos = 'Please upload at least one photo';
    }
    if (tags.current?.length === 0) {
      errors.tags = 'Please add at least one category';
    }
    setFormErrors(errors);

    const urls: string[] = [];
    if (!errors.title && !errors.description && !errors.price && files.length > 0) {
      setLoading(true);
      for (let file of files) {
        const fileNameExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        if (fileNameExt === 'HEIC') {
          const blob = await heic2any({ blob: file, toType: 'image/jpeg' });
          const newFileName = file.name.substr(0, file.name.lastIndexOf('.')) + '.jpeg';
          file = new File([blob as Blob], newFileName, { type: 'image/jpeg' });
        }
        const date = Date.now();
        let imageRef = ref(storage, `images/${currentUser?.id}-${date}-${file.name}`);
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        await uploadBytes(imageRef, compressedFile);
        let url = await getDownloadURL(imageRef);
        urls.push(url);
      }
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    const priceInCents = parseFloat(price as string) * 100;
    const newListing = {
      userId: currentUser?.id,
      currency: 'eur',
      photoUrls: urls,
      latitude: user.current?.latitude,
      longitude: user.current?.longitude,
      title,
      description,
      condition,
      priceInCents,
      tags: tags.current?.length ? tags.current.map((el) => el.replace(/\s+/g, '')).join(' ') : ['Allcategories'],
    };
    try {
      const res = await api.post('/listings', newListing);
      if (res.ok) {
        navigate('/');
      } else {
        console.log('Failed to post listing');
        return <p>Sorry, something went wrong and listing could not be posted</p>; //should have errors
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {loading && <FullScreenLoadingIndicator />}
      <form className="AddListingView" onSubmit={onSubmit}>
        <h3 className="form-title">Add a new Listing</h3>
        <InputField name="title" placeholder="Road Bike" label="Title" error={formErrors.title} fieldref={titleField} />
        <InputField
          name="price"
          placeholder="249.50"
          type="number"
          min={0}
          step="any"
          label="Price"
          error={formErrors.price}
          fieldref={priceField}
        />
        <Form.Group controlId={'condition'} style={{ textAlign: 'left' }}>
          <Form.Label>Condition</Form.Label>
          <FormSelect ref={conditionField}>
            <option value="new">New</option>
            <option value="gentlyUsed">Gently Used</option>
            <option value="used">Used</option>
          </FormSelect>
          <p>{formErrors.condition}</p>
        </Form.Group>

        <InputField
          name="description"
          placeholder="Description"
          min={0}
          label="Description"
          error={formErrors.description}
          fieldref={descriptionField}
          as="textarea"
        />

        <InputField
          name="photos"
          type="file"
          multiple={true}
          placeholder="Photos"
          label="Photos"
          error={formErrors.photos}
          fieldref={photoField}
          onChange={(e) => handleFileSelect(e)}
        />

        <Form.Label htmlFor="categories" style={{ marginRight: 'auto', marginBottom: '5px', marginLeft: '3px' }}>
          Categories
        </Form.Label>
        <AutoCompleteSearch tagStack={tags} />
        {formErrors.tags && <p className="custom-manual-error">Please add at least one category</p>}

        <div className="add-item-buttons">
          <ButtonWide type={'submit'} content={'Create'} fill={true} />
        </div>
      </form>
      <div className="body-footer-container"></div>
    </>
  );
}

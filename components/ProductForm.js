import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {ReactSortable} from "react-sortablejs";
import swal from "sweetalert2";

export default function ProductForm({
                                        _id,
                                        title: existingTitle,
                                        description: existingDescription,
                                        price: existingPrice,
                                        images: existingImages,
                                        category: assignedCategory,
                                        properties: assignedProperties,
                                    }) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }, []);

    async function saveProduct(ev) {
        ev.preventDefault();

        // Check if required fields are filled
        if (!title.trim() || !description.trim() || !price) {
            swal.fire({
                title: 'Error',
                text: 'Please fill in all fields: title, description, and price.',
                icon: 'error',
            });
            return;
        }

        const categoryToSend = category === "" ? null : category;

        const data = {
            title,
            description,
            price,
            images,
            category: categoryToSend,
            properties: productProperties,
        };

        if (_id) {
            await axios.put('/api/products', { ...data, _id });
        } else {
            await axios.post('/api/products', data);
        }

        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/productsList');
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    // Function to remove image
    function removeImage(imageToRemove) {
        setImages(prevImages => prevImages.filter(image => image !== imageToRemove));
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);

        if (catInfo) {
            propertiesToFill.push(...catInfo.properties);
            while (catInfo?.parent?._id) {
                const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
                if (parentCat) {
                    propertiesToFill.push(...parentCat.properties);
                    catInfo = parentCat;
                } else {
                    break;
                }
            }
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input
                type="text"
                placeholder="product name"
                className="rounded-md"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <label>Category</label>
            <select className="rounded-md" value={category}
                    onChange={ev => setCategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div key={p.name} className="">
                    <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                    <div>
                        <select value={productProperties[p.name]}
                                onChange={ev => setProductProp(p.name, ev.target.value)}>
                            {p.values.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable
                    list={images}
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white p-1 shadow-sm rounded-sm border border-gray-200 relative">
                            <img src={link} alt="" className="border border-gray-400" />
                            <button
                                type="button"
                                onClick={() => removeImage(link)}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
                                &times;
                            </button>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-md bg-white shadow-sm border border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <div>
                        Add image
                    </div>
                    <input type="file" onChange={uploadImages} className="hidden" />
                </label>
            </div>
            <label>Description</label>
            <textarea
                placeholder="description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />
            <label>Price (in INR)</label>
            <input
                type="number"
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />
            <button
                type="submit"
                className="btn-primary">
                Save
            </button>
        </form>
    );
}

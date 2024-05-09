import React, { useEffect, useState } from 'react';
import AdminMovieMenu from '../../components/Layout/AdminMovieMenu';
//import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import MovieCategoryForm from '../../components/Form/MovieCategoryForm';
import { Modal } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayoutAdmin from './../../components/Layout/LayoutAdmin';

const CreateMovieCategory = () => {
  const [moviecategories, setMovieCategories] = useState([]);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState('');

  //handle form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:8080/api/v1/moviecategory/create-moviecategory', { name });
      if (data?.success) {
        toast.success(`${name} genre is created`);
        setName(''); // Clear input field after successful creation
        getAllMovieCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong in input');
    }
  };

  //get all category
  const getAllMovieCategory = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/v1/moviecategory/get-moviecategory');
      if (data?.success) {
        setMovieCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something wrong in getting category');
    }
  };

  useEffect(() => {
    getAllMovieCategory();
  }, []);

  //update movie category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`http://localhost:8080/api/v1/moviecategory/update-moviecategory/${selected._id}`, { name: updatedName });
      if (data.success) {
        toast.success(`${updatedName} genre is updated successfully`);
        setSelected(null);
        setUpdatedName('');
        setVisible(false);
        setName(''); // Clear input field after successful update
        getAllMovieCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  //delete movie category
  const handleDelete = async (mId) => {
    // Ask for confirmation before deleting
    const confirmed = window.confirm("Do you want to remove it?");
    if (!confirmed) return; // If user cancels, do nothing

    try {
      const { data } = await axios.delete(`http://localhost:8080/api/v1/moviecategory/delete-moviecategory/${mId}`);
      if (data.success) {
        getAllMovieCategory();
        toast.success('Movie genre is deleted successfully');
      } else {
        toast.error('Movie genre could not be deleted');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <LayoutAdmin title={"movieCategory"}>
    <div className="container-fluid m-4 p-3">
      <div className="row">
        <div className="col-md-3">
          <AdminMovieMenu />
        </div>

        <div className="col-md-9">
          <h4>Manage Movie Genres</h4>
          <div class="p-3 w-50">
            <MovieCategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
          </div>
          <div classname="w-70">
            <table className="table w-50">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {moviecategories?.map((c) => (
                  <>
                    <tr>
                      <td key={c._id}>{c.name}</td>
                      <td>
                        <button className="btn btn-primary ms-3" onClick={() => { setVisible(true); setUpdatedName(c.name); setSelected(c); }}>Edit</button>
                        <button className="btn btn-danger ms-3" onClick={() => { handleDelete(c._id); }}>Delete</button>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
            <MovieCategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
          </Modal>
        </div>
      </div>
      <ToastContainer />
    </div>
    </LayoutAdmin>
  );
};

export default CreateMovieCategory;

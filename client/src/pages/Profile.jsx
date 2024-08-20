import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import conf from  "../conf/conf"
import { storage } from '../firebase/conf';
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../slice/userSlice';


function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            profilePicture: downloadURL,
          }))
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        dispatch(updateUserStart());
        
        const res = await fetch(`${conf.baseURL}/user/update/${currentUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.accessToken}` // Add Authorization header
            },
            body: JSON.stringify(formData),
            credentials: 'include', // Correct option for including cookies
        });
  
        if (!res.ok) {
            // If response status is not OK, handle the error
            const errorData = await res.json();
            dispatch(updateUserFailure(errorData));
            return;
        }
  
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
            dispatch(updateUserFailure(data));
            return;
        }
  
        dispatch(updateUserSuccess(data.data.user));
        setUpdateSuccess(true);
    } catch (error) {
        dispatch(updateUserFailure({ message: error.message }));
    }
};


  // const handleDeleteAccount = async () => {
  //   try {
  //     dispatch(deleteUserStart());
  //     const res = await fetch(`http://localhost:8000/user/delete/${currentUser._id}`, {
  //       method: 'DELETE'
        
  //     });
  //     console.log("PRas",res);
  //     const data = await res.json();
  //     console.log(data);
  //     if (data.success === false) {
  //       dispatch(deleteUserFailure(data));
  //       return;
  //     }
  //     dispatch(deleteUserSuccess(data));
  //   } catch (error) {
  //     dispatch(deleteUserFailure(error));
  //   }
  // };
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
  
      const res = await fetch(`${conf.baseURL}/user/delete/${currentUser.user_id}`, {
        method: 'DELETE',
        credentials: 'include', 
      });
  
      console.log("Response:", res);
  
      const data = await res.json();
      console.log("Data:", data);
  
      if (!res.ok || data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
  
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };
 // Import axios

// const handleDeleteAccount = async () => {
//   try {
//     dispatch(deleteUserStart());

//     const res = await axios.delete(`http://localhost:8000/user/delete/${currentUser._id}`, {
//       withCredentials: true, // This ensures cookies are sent with the request
//     });

//     console.log("Response:", res);

//     const data = res.data; // Axios automatically parses the JSON response
//     console.log("Data:", data);

//     if (res.status !== 200 || data.success === false) { // Check for success in response data
//       dispatch(deleteUserFailure(data));
//       return;
//     }

//     dispatch(deleteUserSuccess(data));
//   } catch (error) {
//     dispatch(deleteUserFailure(error));
//   }
// };

  


  // const handleSignOut = async () => {
  //   try {
  //     const resp = await fetch("http://localhost:8000/auth/sign-out",{
  //       method:"GET"
  //     });
  //     console.log(resp);
  //     dispatch(signOut());
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const handleSignOut = async () => {
  //   try {
  //     const resp = await fetch("http://localhost:8000/auth/sign-out", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       }
  //     });
  //    document.cookie = "accessToken"+ '=; Max-Age=0'; 
  
  //     // if (!resp.ok) {
  //     //   throw new Error(`Sign out failed with status ${resp.status}`);
  //     // }
  // console.log(resp);
  //     const data = await resp.json();
  //     console.log( data.message);
  
  //     dispatch(signOut());
  //   } catch (error) {
  //     console.error('Sign out error:', error);
  //   }
  // };

  const handleSignOut = async () => {
    try {
      const resp = await fetch(`${conf.baseURL}/auth/sign-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Ensure the request includes the cookie
      });
      
      if (!resp.ok) {
        throw new Error(`Sign out failed with status ${resp.status}`);
      }
  
      // Attempt to delete the cookie
      // document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; secure";
  
      const data = await resp.json();
      console.log(data.message);
  
      dispatch(signOut());
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type='text'
          id='username'
          placeholder='Username'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-700 cursor-pointer'
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'User is updated successfully!'}
      </p>
    </div>
  );
}

export default Profile;

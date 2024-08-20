import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux'; // Import useDispatch for Redux
import { useNavigate } from 'react-router-dom'; // Import useNavigate for React Router
import { signInSuccess } from '../slice/userSlice'; // Import your signInSuccess action
import { auth } from '../firebase/conf'; // Adjust the import if necessary

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Call useNavigate as a function

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log(data.data.user);
      dispatch(signInSuccess(data.data.user));  
      navigate('/'); 
    } catch (error) {
      console.log('Could not login with Google', error);
    }
  };

  return (
    <button
      type='button'
      onClick={handleGoogleClick}
      className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'
    >
      Continue with Google
    </button>
  );
}

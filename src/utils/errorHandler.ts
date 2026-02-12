import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    console.log('ERROR STATUS:', error.response?.status)
    console.log('ERROR DATA:', error.response?.data)
    console.log('ERROR FULL:', error.response)
    const data = error.response?.data as any;

    return (
      data?.message ||
      data?.error ||
      data?.msg ||
      error.message ||
      'Something went wrong'
    );
  }
  // Handle non-axios JS errors
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

/* 
What error.response.data actually is

When an API fails, backend usually returns JSON like this:

{
  "error": "Invalid email or password"
}


OR like this:

{
  "message": "User already exists"
}


OR sometimes:

{
  "msg": "Token expired"
}


⚠️ There is NO universal standard.
The backend decides the key name.

*/

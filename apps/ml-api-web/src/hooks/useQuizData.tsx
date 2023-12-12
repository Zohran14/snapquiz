import useSWR from 'swr';
import axios from 'axios'
// Define a fetcher function to make the actual HTTP request.
const fetcher = async ([url, text]: Array<string>) => {
  console.log("text: ", text)
  const res = await axios.post(url, {
    data: text
  })
  console.log("data: ", res.data)
  return res.data
}  

const useQuizData = (url: string, text: string) => {
  const { data, error } = useSWR([url, text], fetcher);

  if (error) {
    // Handle error, e.g., show an error message or retry the request.
    console.error('Error:', error);
  }

  return {
    data,
    isLoading: !data && !error,
    error: error
  };
};

export default useQuizData;

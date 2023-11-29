import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { db } from '../src/app/Firebase';
import { auth } from '../src/app/Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const News = () => {
  const router = useRouter();
  const [newsData, setNewsData] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [likedArticles, setLikedArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);

  // Function to track user interactions and save in local storage
  const trackUserInteraction = (article) => {
    setSelectedArticles((prevSelectedArticles) => [...prevSelectedArticles, article]);
    localStorage.setItem('selectedNewsInteraction', JSON.stringify(article));
  };

  const handleReadMore = (article) => {
    trackUserInteraction(article);
    const { title, description, urlToImage, content } = article;

    // Push to the router with the appropriate pathname and query parameters
    router.push({
      pathname: '/ArticleDetail',
      query: { title, description, urlToImage, content },
    });
  };

  const toggleHeart = async (article) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        // Handle the case when the user is not authenticated
        console.error('User not authenticated');
        return;
      }

      const userUid = user.uid;

      // Get the user document reference for the currently authenticated user
      const userRef = doc(db, 'users', userUid);

      // Get the current liked articles array from Firestore
      const userSnap = await getDoc(userRef);
      const currentLikedArticles = userSnap.data().likedArticles || [];

      // Check if the article is already liked
      const isLiked = currentLikedArticles.some((likedArticle) => likedArticle.url === article.url);

      // Update the liked articles array
      let updatedLikedArticles;
      if (isLiked) {
        updatedLikedArticles = currentLikedArticles.filter((likedArticle) => likedArticle.url !== article.url);
      } else {
        updatedLikedArticles = [...currentLikedArticles, article];
      }

      // Set the updated array back to Firestore
      await updateDoc(userRef, { likedArticles: updatedLikedArticles });

      // Update the local state
      setLikedArticles(updatedLikedArticles);

      // Update local storage
      localStorage.setItem('likedArticles', JSON.stringify(updatedLikedArticles));
    } catch (error) {
      console.error('Error toggling heart:', error);
    }
  };

  const fetchData = async () => {
    try {
      if (navigator.onLine) {
        const response = await fetch(
          "https://newsapi.org/v2/everything?q=apple&from=2023-11-27&to=2023-11-27&sortBy=popularity&apiKey=3e85013b0570459c82ecfe342bac9aa5"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }

        const data = await response.json();
        setNewsData(data.articles);

        // Don't store the entire array in local storage, only the selected article
        if (selectedArticles.length > 0) {
          localStorage.setItem('selectedNewsInteraction', JSON.stringify(selectedArticles[selectedArticles.length - 1]));
        }
      } else {
        // If offline, try to get data from local storage if available
        const cachedData = JSON.parse(localStorage.getItem('selectedNewsInteraction'));
        if (cachedData) {
          setSelectedArticles((prevSelectedArticles) => [...prevSelectedArticles, cachedData]);
        }
      }
    } catch (error) {
      console.error("Error fetching news data:", error);

      // If an error occurs, try to get data from local storage if available
      const cachedData = JSON.parse(localStorage.getItem('selectedNewsInteraction'));
      if (cachedData) {
        setSelectedArticles((prevSelectedArticles) => [...prevSelectedArticles, cachedData]);
      }
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();

    // Add event listeners for online/offline events
    window.addEventListener('online', fetchData);
    window.addEventListener('offline', fetchData);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('online', fetchData);
      window.removeEventListener('offline', fetchData);
    };
  }, []); // No dependencies, only run on mount

  useEffect(() => {
    // Load liked articles from local storage on mount
    const storedLikedArticles = JSON.parse(localStorage.getItem('likedArticles')) || [];
    setLikedArticles(storedLikedArticles);
  }, []);

  const toggleGridView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className="container mx-auto mt-8">
      <button
        onClick={toggleGridView}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {isGridView ? "Switch to List View" : "Switch to Grid View"}
      </button>
      <div className={isGridView ? "grid grid-cols-3 gap-4" : ""}>
        {selectedArticles.length > 0 ? (
          // Render only the selected articles
          selectedArticles.map((selectedArticle, index) => (
            <div key={index} className="border p-4 rounded-md relative">
              <img
                src={selectedArticle.urlToImage}
                alt={selectedArticle.title}
                className="mb-2 w-full h-48 object-cover rounded-md"
                onClick={() => handleReadMore(selectedArticle)}
              />
              <div className="absolute top-0 right-0 p-2">
                <button
                  onClick={() => toggleHeart(selectedArticle)}
                  style={{
                    color: likedArticles.some((likedArticle) => likedArticle.url === selectedArticle.url) ? 'red' : 'black',
                    fontSize: '30px',
                  }}
                >
                  &#x2665;
                </button>
              </div>
              <h2 className="text-lg font-semibold mb-2">{selectedArticle.author}</h2>
              <h2 className="text-lg font-semibold mb-2">{selectedArticle.title}</h2>
              <button onClick={() => handleReadMore(selectedArticle)}>Read More</button>
            </div>
          ))
        ) : (
          // Render the entire list of articles
          newsData.map((article) => (
            <div key={article.url} className="border p-4 rounded-md relative">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="mb-2 w-full h-48 object-cover rounded-md"
                onClick={() => handleReadMore(article)}
              />
              <div className="absolute top-0 right-0 p-2">
                <button
                  onClick={() => toggleHeart(article)}
                  style={{
                    color: likedArticles.some((likedArticle) => likedArticle.url === article.url) ? 'red' : 'black',
                    fontSize: '30px',
                  }}
                >
                  &#x2665;
                </button>
              </div>
              <h2 className="text-lg font-semibold mb-2">{article.author}</h2>
              <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
              <button onClick={() => handleReadMore(article)}>Read More</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default News;

import { useRouter } from 'next/router';

const ArticleDetail = () => {
  const router = useRouter();
  const { title, description, urlToImage, content } = router.query;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
        {title}
      </h1>
      <img
        src={urlToImage}
        alt={title}
        className="mb-4 w-full h-64 md:h-80 lg:h-96 object-cover rounded-md"
      />

      <div className="text-gray-700 mb-4">
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          {description}
        </p>
      </div>

      <div className="text-gray-800">
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          {content}
        </p>
      </div>
    </div>
  );
};

export default ArticleDetail;

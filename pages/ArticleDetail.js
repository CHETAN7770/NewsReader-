import { useRouter } from 'next/router';

const ArticleDetail = () => {
  const router = useRouter();
  const { title, description, urlToImage, content } = router.query;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <img src={urlToImage} alt={title} className="mb-4 w-full h-96 object-cover rounded-md" />
      <p className="text-gray-700 mb-4">{description}</p>
      <p className="text-gray-800">{content}</p>
    </div>
  );
};

export default ArticleDetail
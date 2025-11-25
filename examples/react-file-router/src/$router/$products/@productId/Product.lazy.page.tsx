import { useParams } from "react-router";

export const ProductLazyPage = () => {
    const params = useParams<{ productId: string }>();
    return <div>Lazy page Product {params.productId}</div>;
};

import { useParams } from "react-router";

export const ProductLazyPage = () => {
    const params = useParams<{ productId: string }>();

    if (isNaN(Number(params.productId))) throw Error("Error occured");
    return <div>Lazy page Product {params.productId}</div>;
};

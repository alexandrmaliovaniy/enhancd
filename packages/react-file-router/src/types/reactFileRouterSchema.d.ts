
type RouteSchema = Array<{
  path: string;
  element?: React.ReactNode;
  children: RouteSchema[];
}>;

declare module "virtual:react-file-router-schema" {
    export default schema as RouteSchema;
}

declare const window: {
    __BETTER_REACT_FILE_ROUTER__?: Map<object, string>;
}

type IRoute = {
  key?: string;
  name: string;
  title: string;
  path: string;
  private: boolean;
  icon?: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  roles?: string[];
  childs?: IRoute[];
};

export type { IRoute as IRouteModel };

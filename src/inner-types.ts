
type AnyObject = {
  [key: string]: any;
};
type AnyArray = Array<any>;

export type ObjectLike = AnyObject | AnyArray | Map<any, any> | Set<any>;
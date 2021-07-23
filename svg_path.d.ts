export declare type PathNode =
    | {
          command: string;
      }
    | {
          x: number;
          y: number;
      }
    | {
          a: number;
      };
export declare function parse(d: string): PathNode[];
export declare function serialize(nodes: PathNode[]): string;

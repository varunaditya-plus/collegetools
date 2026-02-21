declare module "@central-icons-react/all" {
  import type { FC, SVGProps } from "react";

  export type CentralIconBaseProps = {
    size?: string | number;
    ariaHidden?: boolean;
  } & SVGProps<SVGSVGElement>;

  export type CentralIconProps = CentralIconBaseProps & {
    name: string;
    join?: string;
    fill?: string;
    radius?: string;
    stroke?: string;
    ariaHidden?: boolean;
  };

  export const CentralIcon: FC<CentralIconProps>;
  export default CentralIcon;
}

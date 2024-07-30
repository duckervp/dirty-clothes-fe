import PropType from "prop-types";
import { Helmet } from 'react-helmet-async';

import { LOGO_NAME } from "../../config";

export default function HelmetPro({page}) {
  return (
    <Helmet>
      <title> {page} | {LOGO_NAME} </title>
    </Helmet>
  );
}

HelmetPro.propTypes = {
    page: PropType.string
}

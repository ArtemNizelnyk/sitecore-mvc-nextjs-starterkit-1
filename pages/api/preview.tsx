import { getNextPageProps } from "@uniformdev/next";
import { NextApiRequest } from "next";

export default async (req, res) => {
    // Check the secret and next parameters
    // This secret should only be known to this API route and the CMS
    // if (req.query.secret !== 'MY_SECRET_TOKEN' || !req.query.slug) {
    //   return res.status(401).json({ message: 'Invalid token' })
    // }
    console.log("im in")
    // Fetch the headless CMS to check if the provided `slug` exists
    // getPostBySlug would implement the required fetching logic to the headless CMS
    const asPath = "/" + (req?.query?.slug || "");
    console.log(asPath)
    const props = await getNextPageProps({ asPath });

  
    // If the slug doesn't exist prevent preview mode from being enabled
    if (!props) {
      return res.status(401).json({ message: 'Invalid slug' })
    }
  
    // Enable Preview Mode by setting the cookies
    res.setPreviewData({})
    // Redirect to the path from the fetched post
    // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
    res.redirect(props.path)
  }
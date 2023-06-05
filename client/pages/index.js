import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  
//   axios.get("/api/users/currentuser").catch((err) => {
//     console.log(err.message);
//   });

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
    if (typeof window === 'undefined') {
        // we are on the server
        // requests should be made to the cluster's namespace
        const namespace = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser';
        const response = await axios.get(namespace, {
            headers: req.headers
        });
        return response.data;
    } else {
        // we are on the browser
        // requests can be made with a base url of ''
        const response = await axios.get('/api/users/currentuser');
        return response.data;
    }


    return {};
}

export default LandingPage;
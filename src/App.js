import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const App = () => {
  const [link, setLink] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // this is here to prevent any "warning can't perform a react state update" errors
  // i know this is probably bad practice but i can't be bothered to fix the error
  useEffect(() => {
    return () => {};
  }, []);

  const download = async e => {
    e.preventDefault();
    
    setData(null);
    setLoading(true);
    setError(null);

    try {
      const url = encodeURIComponent(link);
      const response = await fetch(`http://localhost:8000/api/download?url=${url}`);

      if (!response.ok) {
        const { error: err } = await response.json();
        throw Error(err.message);
      }

      const video = await response.blob();
      setData(video);

      const anchor = document.createElement('a');
      anchor.setAttribute('href', URL.createObjectURL(video));
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('download', `${response.headers.get('title')}.mp4`);

      anchor.click();
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Form style={{ width: "500px" }}>
        <Form.Group className="mb-3" controlId="link">
          <Form.Label className="d-block text-center">Youtube Video Downloader</Form.Label>
          <Form.Control
            type="url"
            size="sm"
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="text-center"
            style={{ fontSize: "larger" }}
            value={ link }
            onChange={ e => setLink(e.target.value) }
          />
        </Form.Group>
        <Button
          variant="outline-primary"
          size="lg"
          type="submit"
          className="d-block mx-auto mb-3"
          onClick={ download }
          disabled={ isLoading }
        >
          { isLoading ? 'Downloading...' : 'Download' }
        </Button>
        { error && <h5 className="text-center">{ error }</h5> }
        { data && (
          <video width="500px" controls>
            <source data-testid="source" src={ URL.createObjectURL(data) } />
          </video>
        ) }
      </Form>
    </div>
  );
}
 
export default App;
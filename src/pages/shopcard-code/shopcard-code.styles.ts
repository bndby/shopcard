import { css } from 'lit';

export const styles = css`
  .code {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background: #ccc;
  }

  .barcode {
    margin: 20px;
    padding: 40px;
    border: 3px solid #999;
    border-radius: 25px;
    width: 80%;
    background: #fff;
  }

  .hint {
    color: #444;
  }

  .edit {
    position: absolute;
    bottom: 20px;
    rigth: 20px;
  }
`;


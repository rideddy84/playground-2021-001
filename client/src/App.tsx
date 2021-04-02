import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Coupon {
  name: string
  discount: number
  code: string
  createdAt: Date
}

function App() {
  const [name, setName] = useState('')
  const [type, setType] = useState('percent')
  const [count, setCount] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [alertText, setAlertText] = useState('')

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const { data } = await axios.get('/coupons');

    setCoupons(data)
  }

  const generateCoupons = async () => {
    if (!name || !count || !discount) {
      setAlertText('쿠폰 이름, 할인량, 생성 수량은 필수입니다.')
      return
    }
    if (type === 'percent') {
      if (discount > 99) {
        setAlertText('할인은 최대 99%까지 허용합니다.')
      }
    }

    const promises = []

    for (let i = 0; i < count; i++) {
      promises.push(axios.post('/coupons', {
        name,
        type,
        discount,
        code: makeid(10)
      }));
    }
    await Promise.all(promises)
    getData()
    setAlertText('쿠폰을 생성했습니다.')
  }

  return (
    <div className="container">
      <div>
        <h4>Generate new coupons</h4>
        <div>
          <label>Coupon Name</label>
          <input type="text" value={name} onChange={(e) => {
            setName(e.target.value || '')
          }} />
        </div>
        <div>
          <label>Disount(price or percent)</label>
          <input type="number" min="1" value={discount} onChange={(e) => {
            setDiscount(e.target.valueAsNumber || 0)
          }} />
        </div>
        <div>
          <label>Count</label>
          <input type="number" min="1" max="100000" value={count} onChange={(e) => {
            setCount(e.target.valueAsNumber || 0)
          }} />
        </div>
        <div>
          <button className="btn btn-primary" onClick={generateCoupons}>Generate</button>
        </div>
      </div>
      <p>
        {alertText}
      </p>
      <table className="table">
        <tbody>
          {
            coupons && coupons.map(coupon => {
              return <tr key={coupon.code}>
                <td>{coupon.name}</td>
                <td>{coupon.discount}</td>
                <td>{coupon.code}</td>
                <td>{coupon.createdAt}</td>
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;

function makeid(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
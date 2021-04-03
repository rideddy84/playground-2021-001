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
  const [totalCount, setTotalCount] = useState(0)
  const [count, setCount] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [alertText, setAlertText] = useState('')

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const { data: totalCount } = await axios.get('/coupons/count');
    const { data } = await axios.get('/coupons?take=20');
    setTotalCount(totalCount)
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
    await axios.post('/coupons/generate', {
      name,
      type,
      discount,
      count
    })
    setAlertText(`쿠폰을 생성을 ${count}개 요청했습니다. 양에 따라 시간이 다소 소요될 수 있습니다.`)
    getData()
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-auto">
            <div>
              <h4>Generate new coupons</h4>
              <div className="mb-3">
                <label className="form-label">Coupon Name</label>
                <input className="form-control" type="text" value={name} onChange={(e) => {
                  setName(e.target.value || '')
                }} />
              </div>
              <div className="mb-3">
                <label className="form-label">Disount(price or percent)</label>
                <input className="form-control" type="number" min="1" value={discount} onChange={(e) => {
                  setDiscount(e.target.valueAsNumber || 0)
                }} />
              </div>
              <div className="mb-3">
                <label className="form-label">Count</label>
                <input className="form-control" type="number" min="1" max="100000" value={count} onChange={(e) => {
                  setCount(e.target.valueAsNumber || 0)
                }} />
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={generateCoupons}>Generate</button>
                <p className="text-muted">
                  {alertText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-auto me-auto"><strong>Total: {totalCount}</strong></div>
          <div className="col-auto"><button className="btn btn-light" onClick={getData}>Refresh</button></div>
        </div>
        <div className="row">
          <div className="col-auto">
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
        </div>
      </div>
    </>
  );
}

export default App;
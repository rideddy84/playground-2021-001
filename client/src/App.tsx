import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';

interface Coupon {
  name: string
  discount: number
  code: string
  createdAt: Date
  type: string
}

const socket = new WebSocket('ws://localhost:3002');
socket.onopen = function () {
  socket.onmessage = function (data) {
    console.log(data);
  };
};

function App() {
  const [name, setName] = useState('')
  const [type, setType] = useState('percent')
  const [totalCount, setTotalCount] = useState(0)
  const [count, setCount] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [alertText, setAlertText] = useState('')
  const [searchOption, setSearchOption] = useState({
    page: 1,
    pageSize: 10,
    type: ''
  })

  useEffect(() => {
    getData();
  }, [searchOption])

  const getData = async () => {
    const {
      page, pageSize, type
    } = searchOption
    const countParams = new URLSearchParams({
      type
    })
    const listParams = new URLSearchParams({
      skip: ((page - 1) * pageSize).toString(),
      take: pageSize.toString(),
      type
    })
    const { data: totalCount } = await axios.get('/coupons/count?' + countParams.toString());
    const { data } = await axios.get('/coupons?' + listParams.toString());
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
        return
      }
    }
    const { data } = await axios.post('/coupons/generate', {
      name,
      type,
      discount,
      count
    });
    setAlertText(`쿠폰을 생성을 ${count}개 요청했습니다. 양에 따라 시간이 다소 소요될 수 있습니다. - ${moment().format('YYYY-MM-DD HH:mm')}`)
    getData()
    socket.send(
      JSON.stringify({
        event: 'newJobId',
        data: data.id,
      }),
    );
  }

  const {
    page,
    pageSize,
  } = searchOption

  let totalPage = Math.ceil(totalCount / pageSize)
  let startPage = Math.floor(page / 10) * 10
  if (page % 10 === 0) {
    startPage = startPage - 9
  } else {
    startPage++
  }
  let endPage = startPage + 9
  if (endPage > totalPage) {
    endPage = totalPage
  }
  const pages = []
  while (pages.length < endPage - startPage + 1) {
    pages.push(startPage + pages.length)
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
                <label className="form-label">Coupon Type</label>
                <input id="type-percent" className="form-check-input" type="radio" name="type" defaultChecked={true} onClick={(e) => {
                  setType('percent')
                }} />
                <label className="form-check-label" htmlFor="type-percent">
                  Percent
                </label>
                <input id="type-amount" className="form-check-input" type="radio" name="type" onClick={(e) => {
                  setType('amount')
                }} />
                <label className="form-check-label" htmlFor="type-amount">
                  Amount
                </label>
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
                  let newCount = e.target.valueAsNumber || 0
                  if (newCount > 100000) {
                    newCount = 100000
                  }
                  setCount(newCount)
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
          <div className="col-auto me-auto"><strong>Total: {totalCount}</strong>
            <label className="form-label">Coupon Type</label>
            <input id="search-type-all" className="form-check-input" type="radio" name="search-type" defaultChecked={true} onClick={(e) => {
              setSearchOption({
                ...searchOption,
                type: '',
                page: 1
              })
            }} />
            <label className="form-check-label" htmlFor="search-type-all">
              All
            </label>
            <input id="search-type-percent" className="form-check-input" type="radio" name="search-type" defaultChecked={true} onClick={(e) => {
              setSearchOption({
                ...searchOption,
                type: 'percent',
                page: 1
              })
            }} />
            <label className="form-check-label" htmlFor="search-type-percent">
              Percent
            </label>
            <input id="search-type-amount" className="form-check-input" type="radio" name="search-type" onClick={(e) => {
              setSearchOption({
                ...searchOption,
                type: 'amount',
                page: 1
              })
            }} />
            <label className="form-check-label" htmlFor="search-type-amount">
              Amount
            </label>
          </div>
          <div className="col-auto"><button className="btn btn-light" onClick={getData}>Refresh</button></div>
        </div>
        <div className="row">
          <div className="col-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Disount(price or percent)</th>
                  <th>Code</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {
                  coupons && coupons.map(coupon => {
                    return <tr key={coupon.code}>
                      <td>{coupon.name}</td>
                      <td>{coupon.type}</td>
                      <td>{coupon.discount}</td>
                      <td>{coupon.code}</td>
                      <td>{moment(coupon.createdAt).format()}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
            <div>{page} / {totalPage}</div>
            <nav aria-label="Page navigation">
              <ul className="pagination">
                {
                  page > 1 && <li className="page-item"><a className="page-link" href="#" onClick={() => {
                    setSearchOption({
                      ...searchOption,
                      page: page - 1
                    })
                  }}>Previous</a></li>
                }
                {
                  pages.map(p => {
                    return <li key={p} className="page-item" style={{ fontWeight: p === page ? 'bold' : 'normal' }}><a className="page-link" href="#" onClick={() => {
                      setSearchOption({
                        ...searchOption,
                        page: p
                      })
                    }}>{p}</a></li>
                  })
                }
                {
                  totalPage > page && <li className="page-item"><a className="page-link" href="#" onClick={() => {
                    setSearchOption({
                      ...searchOption,
                      page: page + 1
                    })
                  }}>Next</a></li>
                }
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
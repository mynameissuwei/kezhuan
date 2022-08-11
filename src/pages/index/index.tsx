import Taro, { usePullDownRefresh } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Table from "taro3-table";
import { useState, useEffect, useRef } from "react";
import "./index.less";
import { AtTabs, AtTabsPane, AtButton } from "taro-ui";

const Index = () => {
  const [data, setData] = useState([]);
  const cacheData = useRef([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const tabList = [
    { title: "低溢价转债前20" },
    { title: "双低转债前20" },
    { title: "低规模前20" }
  ];

  const columns = [
    {
      title: "名字",
      dataIndex: "name"
    },
    {
      title: "价格",
      dataIndex: "price"
    },
    {
      title: "溢价率",
      dataIndex: "premium_rt"
    }
  ];

  const columnsDb = [
    {
      title: "名字",
      dataIndex: "name"
    },
    {
      title: "价格",
      dataIndex: "price"
    },
    {
      title: "双低",
      dataIndex: "double_low"
    }
  ];

  const columnsSize = [
    {
      title: "名字",
      dataIndex: "name"
    },
    {
      title: "价格",
      dataIndex: "price"
    },
    {
      title: "剩余市值",
      dataIndex: "curr_iss_amt"
    }
  ];

  const handleClick = async value => {
    setCurrent(value);
    if (value === 0) {
      const result = cacheData.current.sort(
        (a: any, b: any) => a.premium_rt - b.premium_rt
      );
      setData(result.slice(0, 20));
    }
    if (value === 1) {
      const result = cacheData.current.sort(
        (a: any, b: any) => a.double_low - b.double_low
      );
      setData(result.slice(0, 20));
    }
    if (value === 2) {
      const result = cacheData.current.sort(
        (a: any, b: any) => a.curr_iss_amt - b.curr_iss_amt
      );
      setData(result.slice(0, 20));
    }
  };
  const fetchData = async () => {
    setCurrent(0);
    setLoading(true);
    const sign = "60874ED168FA1C9DEA2D444DB0B1691D";
    const url = "http://117.50.175.2:23130/info";
    const header = { "content-type": "application/x-www-form-urlencoded" };
    const data = { sign: sign, args: null };
    await Taro.request({
      url, //仅为示例，并非真实的接口地址
      data,
      method: "POST",
      header,
      success: res => {
        setData(res.data.data.slice(0, 20));
        cacheData.current = res.data.data;
      },
      fail: () => {}
    });
    setLoading(false);
  };
  usePullDownRefresh(async () => {
    Taro.startPullDownRefresh();
    await fetchData();
    Taro.stopPullDownRefresh();
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View className="index">
      <AtButton type="primary" size="small" onClick={fetchData} full={false}>
        刷新数据
      </AtButton>

      <AtTabs current={current} tabList={tabList} onClick={handleClick}>
        <AtTabsPane current={current} index={0}>
          <View style="padding: 20px 0px;background-color: #FAFBFC;text-align: center;">
            <Table
              columns={columns}
              dataSource={data}
              loading={loading}
              style={{
                margin: "0 auto",
                width: "92vw"
              }}
              scroll={{
                x: "100vw",
                y: 400
              }}
            />
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View style="padding: 20px 0px;background-color: #FAFBFC;text-align: center;">
            <Table
              columns={columnsDb}
              dataSource={data}
              loading={loading}
              style={{
                margin: "0 auto",
                width: "92vw"
              }}
              scroll={{
                x: "100vw",
                y: 400
              }}
            />
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <View style="padding: 20px 0px;background-color: #FAFBFC;text-align: center;">
            <Table
              columns={columnsSize}
              dataSource={data}
              loading={loading}
              style={{
                margin: "0 auto",
                width: "92vw"
              }}
              scroll={{
                x: "100vw",
                y: 400
              }}
            />
          </View>
        </AtTabsPane>
      </AtTabs>
    </View>
  );
};

export default Index;

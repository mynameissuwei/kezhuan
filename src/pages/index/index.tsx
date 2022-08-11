import Taro, { usePullDownRefresh } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Table from "taro3-table";
import { useState, useEffect, useRef } from "react";
import "./index.less";
import { AtTabs, AtTabsPane, AtButton, AtNoticebar } from "taro-ui";

const Index = () => {
  const cacheData = useRef([]);

  const [data, setData] = useState([]);
  const [dbData, setDbData] = useState([]);
  const [sizeData, setSizeData] = useState([]);
  const [kkData, setKkData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  const tabList = [
    { title: "低溢价转债前20" },
    { title: "双低转债前20" },
    { title: "低规模前20" },
    { title: "双低40-低规模前20" }
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

  const fColumns = [
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
    },
    {
      title: "剩余市值",
      dataIndex: "curr_iss_amt"
    }
  ];

  const handleClick = async value => {
    setCurrent(value);
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
        cacheData.current = res.data.data;
        setData(res.data.data.slice(0, 20));
        const result = cacheData.current.sort(
          (a: any, b: any) => a.double_low - b.double_low
        );
        setDbData(result.slice(0, 20));
        const lData = cacheData.current.sort(
          (a: any, b: any) => a.curr_iss_amt - b.curr_iss_amt
        );
        setSizeData(lData.slice(0, 20));
        const kData = cacheData.current.sort(
          (a: any, b: any) => a.double_low - b.double_low
        );
        const fData = kData
          .slice(0, 40)
          .sort((a: any, b: any) => a.curr_iss_amt - b.curr_iss_amt);
        setKkData(fData.slice(0, 20));
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

      <AtTabs current={current} tabList={tabList} onClick={handleClick} scroll>
        <AtTabsPane current={current} index={0}>
          <View style="padding: 20px 0px;background-color: #FAFBFC;text-align: center;">
            <AtNoticebar>低溢价指标排序从小到大,取前20</AtNoticebar>

            <Table
              columns={columns}
              dataSource={data}
              loading={loading}
              style={{
                margin: "10px auto",
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
            <AtNoticebar>双低指标排序从小到大,取前20</AtNoticebar>
            <Table
              columns={columnsDb}
              dataSource={dbData}
              loading={loading}
              style={{
                margin: "10px auto",
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
            <AtNoticebar>剩余规模指标排序从小到大,取前20</AtNoticebar>

            <Table
              columns={columnsSize}
              dataSource={sizeData}
              loading={loading}
              style={{
                margin: "10px auto",
                width: "92vw"
              }}
              scroll={{
                x: "100vw",
                y: 400
              }}
            />
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={3}>
          <View style="padding: 20px 0px;background-color: #FAFBFC;text-align: center;">
            <AtNoticebar>
              双低指标排序从小到大,取前40, 然后按照剩余规模指标取前20
            </AtNoticebar>

            <Table
              columns={fColumns}
              dataSource={kkData}
              loading={loading}
              style={{
                margin: "10px auto",
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

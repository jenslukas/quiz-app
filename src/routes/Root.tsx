import React from 'react';
import './../index.css';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu, theme, MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const { Header, Content, Footer } = Layout;

export default function Root() {
    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        children?: MenuItem[],
        type?: 'group',
    ): MenuItem {
        return {
            key,
            icon,
            children,
            label,
            type,
        } as MenuItem;
    }

    const items: MenuItem[] = [
        getItem('', '1', <Link to="/">Home</Link>),
        getItem('', '2', <Link to="/runlist">Quiz Runs</Link>),        
        getItem('', '3', <Link to="/question">Validate</Link>),
    ];
    const {
        token: { colorBgContainer },
    } = theme.useToken();


    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={items}
                />
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <div className="site-layout-content" style={{ background: colorBgContainer }}><Outlet /></div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©2023 Created by Lukas Laboriaties</Footer>
        </Layout>
    )
}
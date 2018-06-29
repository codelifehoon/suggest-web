import React from 'react';
import MemberLogin from "../member/MemberLogin";
import RegistryPlan from "../content/RegistryPlan";
import ContentMain from "../content/ContentMain";
import ActivityManager from "../content/ActivityManager";




class TemplateSelector  {

    static getTemplateList = () => {
        let pageList = [
            {componentName : 'main', componentObj: null , componentTitle:'메인' , key:100},
            {componentName : 'memberLogin', componentObj: <MemberLogin/> , componentTitle:'로그인',key:200},
            {componentName : 'registryPlan', componentObj: <RegistryPlan/> , componentTitle:'등록',key:300},
            {componentName : 'editRegistryPlan', componentObj: <RegistryPlan/> , componentTitle:'수정',key:400},
            {componentName : 'contentMain', componentObj: <ContentMain/>, componentTitle:'상세보기',key:500},
            {componentName : 'activityManager', componentObj: <ActivityManager/>, componentTitle:'게시물 관리',key:600},
        ];

        return pageList;
    };

    static getComponent = (componentName) =>{
        return TemplateSelector.getTemplateList().find( (item) => {

            return item.componentName == componentName
        });

    };

    static getComponentName = (componentName) =>{
        return TemplateSelector.getComponent(componentName).componentName;
    };

    static getComponentObj = (componentName) =>{
        return TemplateSelector.getComponent(componentName).componentObj;
    };

    static getComponentTitle = (componentName) =>{
        return TemplateSelector.getComponent(componentName).componentTitle;
    };




}


export  default (TemplateSelector);
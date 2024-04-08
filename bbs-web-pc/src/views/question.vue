<!--问题内容-->
<template>
    <!-- 页头 -->
    <Header/>

    <div class="main">
        <div class="main-container wrap">
            <div class="questionContentModule">
                <div class="left" v-if="state.question == undefined || state.question == null  || Object.keys(state.question).length==0" >
                    <div class="question-wrap" style="padding: 20px 20px;">
                        <el-skeleton :loading="state.question_loading"></el-skeleton>
                    </div>
                </div>
	            <div class="left" v-if="state.question != undefined && state.question != null && Object.keys(state.question).length>0">
                    <div class="question-wrap">
                        <div class="questionTag">
                            <template v-for="questionTag in state.question.questionTagAssociationList">
                                <router-link tag="a" class="tag" :to="{path:'/askList',query: {questionTagId: questionTag.questionTagId}}">
                                    {{questionTag.questionTagName}}
                                </router-link>
                            </template>
                        </div>
                        <div class="rightInfo">
                            <div class="report" v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0" @click="addReportUI(state.questionId,40)">
                                <span><Icon name="error-warning-line" size="16px" class="icon"/>举报</span>
                            </div>
                            <div class="appendQuestion" v-if="state.question.userName == $store.state.systemUser.userName">
                                <span @click="appendQuestionUI(state.questionId);"> <Icon name="append" size="16px" class="icon"/>追加提问</span>
                            </div>
                            
                            <div class="ipAddress" v-if="state.question.ipAddress != null && state.question.ipAddress != ''">
                                <span><Icon name="map-pin-line" size="15px" class="icon"/>{{state.question.ipAddress}}</span>
                            </div>
                        </div>
                        <div class="questionBox">
                            <div class="title">{{state.question.title}}</div>
                            
                            <!-- 追加问题表单 -->
                            <div class="appendQuestion-formModule" v-if="state.appendQuestionFormView">
                                <div class="appendQuestion-wrap">
                                    <el-form label-position="right" :ref="'formAppendQuestionRef'" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                        <el-form-item :error="error.appendQuestionContent">
                                            

                                            <div v-show="!state.isAppendQuestionMarkdown" style="width: 100%;">
                                                <textarea :editorId="'appendQuestion'" ref="formAppendQuestionContentRef" style="width:100%;height:230px;visibility:hidden;"></textarea>
                                        
                                            </div>
                                            <div v-if="state.isAppendQuestionMarkdown" style="width: 100%;">
                                                <Editor  :editorId="'appendQuestion'" :value="state.appendQuestionMarkdownContent" :plugins="state.appendQuestionEditorPlugin" :locale="zhHans" :sanitize="appendQuestionSanitize" placeholder="请输入内容..." @change="handleAppendQuestionMarkdownChange"/>
                                            </div>
                                        
                                        </el-form-item>
                                        <el-form-item :error="error.captchaValue.get('appendQuestion-'+state.questionId)" v-if="state.showCaptcha.get('appendQuestion-'+state.questionId)" class="captcha-item">
                                            <el-row>
                                                <el-col :span="10" >
                                                    <el-input  v-model="state.captchaValue['appendQuestion-'+state.questionId]" @change.native="checkCaptchaValueRules('appendQuestion-'+state.questionId)"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                        <template #prefix>
                                                            <Icon name="shield-check-line" size="16px"/>
                                                        </template>
                                                    </el-input>
                                                </el-col>
                                                <el-col :span="8" :offset="1">
                                                    <el-image :src="state.imgUrl.get('appendQuestion-'+state.questionId)" @click="replaceCaptcha('appendQuestion-'+state.questionId)"/>
                                                </el-col>
                                                <el-col :span="4" :offset="1">
                                                    <el-link type="primary" @click="replaceCaptcha('appendQuestion-'+state.questionId)" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item :error="error.question" class="form-action">
                                            <el-button class="submitButton" type="primary"  @mousedown.native="onAppendQuestionFormSubmit()" :disabled="state.allowSubmit.get('appendQuestion-'+state.questionId)">提交</el-button>
                                            <el-button class="submitButton" type="primary"  @mousedown.native="onCancelAppendQuestion()" plain>取消</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        
                            <div class="questionInfo clearfix" >
                                <div class="postTime">{{state.question.postTime}}</div>
                                <div class="viewTotal-icon"><Icon name="view" size="16px" class="icon"/></div>
                                <div class="viewTotal">{{state.question.viewTotal}}次阅读</div>
                                <div class="answer-icon"><Icon name="commentCount" size="16px" class="icon"/></div>
                                <div class="answer">{{state.question.answerTotal}}个回答</div>
                            </div>
                            
                            <div class="reward" v-if="parseFloat(state.question.amount) > 0 || Long.fromString(String(state.question.point)).gt(0)">
                                <div class="info" >
                                    <Icon name="deposit" size="26px" class="icon"/>
                                    悬赏<template v-if="parseFloat(state.question.amount) > 0">金额<span class="symbol">¥</span><span class="amount">{{state.question.amount}}</span>元 </template>
                                    <template v-if="Long.fromString(state.question.point).gt(0)">
                                        <span class="point">{{state.question.point}}</span>积分
                                    </template>
                                </div>
                            </div>
                            
                            <div :class="[state.question.isMarkdown != null && state.question.isMarkdown == true ? 'markdown-body-custom questionMarkdownContent' : 'content', router.currentRoute.value.query.reportModule !=undefined && parseInt(router.currentRoute.value.query.reportModule as string) == 40 ? 'reportMark' : '']" >
                                <div class="cancelAccount" v-if="state.question.account == null || state.question.account == ''">此用户账号已注销</div>
                                
                                <div :ref="el => {if(el) questionRefs['question_'+state.question.id] = el}">
                                   <RenderTemplate :html="state.question.content"></RenderTemplate>
                                </div>     
                            </div>
                            <template v-for="(appendQuestionItem,index) in state.question.appendQuestionItemList">
                                <div :class="(index%2)==0 ? 'appendBox odd' : 'appendBox even'">
                                    <div class="head">
                                        <span class="prompt">第{{index + 1}}条附言</span>
                                        <span class="appendTime">{{appendQuestionItem.postTime}}</span>
                                    </div>
                                    <div :class="[appendQuestionItem.isMarkdown != null && appendQuestionItem.isMarkdown == true ? 'markdown-body-custom appendMarkdownContent' : 'appendContent']" :ref="'appendQuestion_'+appendQuestionItem.id">
                                        <RenderTemplate :html="appendQuestionItem.content"></RenderTemplate>
                                    </div> 
                                </div>		
                            </template>
                            
                            <div class="favorite-formModule" v-if="state.question.userName != null && state.question.userName != ''">
                                 <!--加入收藏夹-->
                                 <span class="numberButton" @click="addFavorite(state.question.id)">
                                    <span class="button" >
                                        <span>{{state.alreadyCollected == true ? '已收藏':'收藏'}}</span>
                                    </span>
                                    <span class="number">{{state.favoriteCount}}</span>
                                </span> 
                            </div>
                        </div>
                    </div>

                    <!-- 问题允许回答 -->
                    <div v-if="state.question.allow">
                        <!-- 已登录 -->
                        <div v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0">
                            <!-- 显示回答表单 -->
                            <div class="answer-formModule" v-if="state.allowAnswer">
                                <div class="addAnswer-wrap">
                                    <el-form label-position="right" :ref="'formAddAnswerRef'" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                        <el-form-item :error="error.content.get('addAnswer-'+state.questionId)">
                                            
                                            <div v-show="!state.isAddAnswerMarkdown" style="width: 100%;">
                                                <textarea :editorId="'addAnswer'" ref="formAddAnswerContentRef" style="width:100%;height:230px;visibility:hidden;"></textarea>
                                            </div>
                                            <div v-if="state.isAddAnswerMarkdown" style="width: 100%;">
                                                
                                                <Editor :editorId="'addAnswer'" :value="state.addAnswerMarkdownContent" :plugins="state.addAnswerEditorPlugin" :locale="zhHans" :sanitize="answerSanitize" placeholder="请输入内容..." @change="handleAddAnswerMarkdownChange"/>
                                           
                                            </div>
                                        
                                        </el-form-item>
                                        
                                        <el-form-item :error="error.captchaValue.get('addAnswer-'+state.questionId)" v-if="state.showCaptcha.get('addAnswer-'+state.questionId)" class="captcha-item">
                                            <el-row>
                                                <el-col :span="10" >
                                                    <el-input  v-model="state.captchaValue['addAnswer-'+state.questionId]" @change.native="checkCaptchaValueRules('addAnswer-'+state.questionId)"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                        <template #prefix>
                                                            <Icon name="shield-check-line" size="16px"/>
                                                        </template>
                                                    </el-input>
                                                </el-col>
                                                <el-col :span="8" :offset="1">
                                                    <el-image :src="state.imgUrl.get('addAnswer-'+state.questionId)" @click="replaceCaptcha('addAnswer-'+state.questionId)"/>
                                                </el-col>
                                                <el-col :span="4" :offset="1">
                                                    <el-link type="primary" @click="replaceCaptcha('addAnswer-'+state.questionId)" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item :error="error.answer.get('addAnswer-'+state.questionId)" class="form-action">
                                            <el-button class="submitButton" type="primary"  @mousedown.native="onAddAnswerFormSubmit" :disabled="state.allowSubmit.get('addAnswer-'+state.questionId)">提交</el-button>
                                            <div class="promptInfo">
                                                <h2>我来说两句，分享我的答案</h2>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                            <!-- 不显示回答表单 -->       
                            <div class="addAnswerModule" v-if="!state.allowAnswer">
                                <div class="addAnswer-wrap">
                                    <div class="respond">
                                        <p>
                                            回答已关闭
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
		
                        <!-- 未登录 -->
                        <div class="addAnswerModule" v-if="$store.state.systemUser == null || Object.keys($store.state.systemUser).length==0">
                            <div class="addAnswer-wrap">
                                <div class="respond">
                                    <p >请 
                                    <router-link tag="a" :to="'/login'">登录</router-link>
                                        后回答。没有帐号？
                                        <router-link tag="a" :to="'/register'">注册</router-link> 一个。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 问题不允许回答 -->
					<div class="addAnswerModule" v-if="!state.question.allow">
                        <div class="addAnswer-wrap">
                            <div class="respond">
                                <p>
                                    本问题回答已关闭
                                </p>
                            </div>
                        </div>
					</div>


                    <div class="answerModule" v-if="state.answerList != null && Object.keys(state.answerList).length>0 && state.answerList.length >0">
                        <ol class="answerList">
                            <div :class="[answer.adoption == true ? 'answer active' : 'answer',router.currentRoute.value.query.reportModule !=undefined && parseInt(router.currentRoute.value.query.reportModule as string) == 50 && answer.id == router.currentRoute.value.query.answerId ? 'reportMark' : '']" v-for="(answer,index) in state.answerList" :key="answer.id"  :ref="'answer_'+answer.id">
                                <div class="answer-author">
                                    <router-link tag="a" v-if="answer.userName != null && answer.userName != ''" :to="{path:'/user/control/home',query: {userName: answer.userName}}">
                                        <img v-if="answer.avatarName != null" :src="answer.avatarPath+'100x100/'+answer.avatarName" class="img">
                                        <img v-if="answer.avatarName == null" :src="answer.avatar" width="62" height="62" class="img"/>
                                        
                                    </router-link>
                                    <img v-if="answer.userName == null && answer.avatarName == null" :src="answer.avatar" width="62" height="62" class="img"/>    
                                    
                                      
                                    
                                    <div class="info-container">
                                        <router-link tag="a" class="userName" :to="{path:'/user/control/home',query: {userName: answer.userName}}">
                                           <span v-if="answer.nickname != null && answer.nickname != ''">{{answer.nickname}}</span>
                                           <span v-if="answer.nickname == null || answer.nickname == ''">{{answer.account}}</span>
                                           <template v-if="answer.account == null || answer.account == ''">&nbsp;</template>
                                        </router-link>
                                        <span v-if="answer.account == null || answer.account == ''" class='cancelNickname'>已注销</span> 
                                        <span class="userRoleName" v-for="roleName in answer.userRoleNameList">{{roleName}}</span>
                                        <span class="staff" v-if="answer.isStaff">官方人员</span>
                                        <span class="master" v-if="answer.userName == state.question.userName && answer.isStaff == state.question.isStaff">作者</span>
                                    </div> 
                                </div>
                                <div class="answerTime">{{answer.postTime}}</div>
                
                                <div class="adoption">
                                    <div class="ribbon-wrapper">
                                        <div class="ribbon">最佳答案</div>
                                    </div>
                                    <!--  
                                    <i class="cms-trophy-solid" ></i><span>最佳答案</span>-->
                                </div>
                                
                                <div :class="[answer.isMarkdown != null && answer.isMarkdown == true ? 'markdown-body-custom answerMarkdownContent' : 'answerContent']" >
                                    <div class="cancelAccount" v-if="answer.account == null || answer.account == ''">此用户账号已注销</div>
                                    
                                    <div :ref="'answerContent_'+answer.id">
                                        <RenderTemplate :html="answer.content"></RenderTemplate>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                
                                <div class="replyList" v-if="answer.answerReplyList != null && answer.answerReplyList.length >0">
                                    <ul class="timeline box">
                                        <li class="timeline-item replyItem-container" v-for="(reply,index2) in answer.answerReplyList" :key="reply.id" :replyId="reply.id" :ref="handleReplyNodes">
                                 
                                            <div class="tail" v-if="state.line.get(reply.id)"></div>
                                            <div class="node node--normal" v-if="state.dot.get(reply.id)"></div>
                                            <div class="replyItem">
                                                <div :class="router.currentRoute.value.query.reportModule !=undefined && parseInt(router.currentRoute.value.query.reportModule as string) == 60 && reply.id == router.currentRoute.value.query.replyId ? 'reply-reportMark' : ''">
                                                    <div class="reply-top" >
                                                        <div class="reply-author">
                                                            <router-link tag="a" v-if="reply.userName!= null && reply.userName != ''" class="avatarBox" :to="{path:'/user/control/home',query: {userName: reply.userName}}">
                                                                <img v-if="reply.avatarName != null" :src="reply.avatarPath+'100x100/'+reply.avatarName" class="img">
                                                                <img v-if="reply.avatarName == null" :src="reply.avatar" width="62" height="62" class="img"/>
                                                                
                                                            </router-link>

                                                            <span v-if="reply.userName == null && reply.avatarName == null"  class="avatarBox">
                                                                <img :src="reply.avatar" width="62" height="62" class="img"/>
                                                            </span>
                                                        
                                                            <span v-if="reply.account == null || reply.account == ''" class='cancelNickname'>已注销</span>   


                                                            <router-link tag="a" v-if="reply.account != null && reply.account != ''" class="userName" :to="{path:'/user/control/home',query: {userName: reply.userName}}">
                                                                <span v-if="reply.nickname != null && reply.nickname != ''">{{reply.nickname}}</span>
                                                                <span v-if="reply.nickname == null || reply.nickname == ''">{{reply.account}}</span>
                                                                <template v-if=" reply.account == null || reply.account == ''">&nbsp;</template>
                                                            </router-link>

                                                            <span class="userRoleName" v-for="roleName in reply.userRoleNameList">{{roleName}}</span>
                                                            <span class="staff" v-if="reply.isStaff">官方人员</span>
                                                            <span class="master" v-if="reply.userName == state.question.userName && reply.isStaff == state.question.isStaff">作者</span>
                                                            <div class="time"> {{reply.postTime}}</div>
                                                        </div>
                                                        <div class="friendInfo" v-if="reply.friendUserName != null && reply.friendUserName != ''">
                                                            <span class="arrow"><icon name="caret-right" size="14px"/></span>
                                                            <router-link tag="a" v-if="reply.friendUserName!= null && reply.friendUserName != ''" class="friendAvatarBox" :to="{path:'/user/control/home',query: {userName: reply.friendUserName}}">
                                                                <img v-if="reply.friendAvatarName != null" :src="reply.friendAvatarPath+'100x100/'+reply.friendAvatarName" class="img">
                                                                <img v-if="reply.friendAvatarName == null" :src="reply.friendAvatar" width="20" height="20" class="img"/>
                                                                
                                                            </router-link>
                                                            
                                                            <h2 class="nameInfo" >
                                                                <span v-if="reply.friendAccount == null || reply.friendAccount == ''" class="cancelNickname">已注销</span>  
                                                                
                                                                <router-link tag="a" v-if="reply.friendAccount != null && reply.friendAccount != ''" class="userName" :to="{path:'/user/control/home',query: {userName: reply.friendUserName}}">
                                                                    <span v-if="reply.friendNickname != null && reply.friendNickname != ''">{{reply.friendNickname}}</span>
                                                                    <span v-if="reply.friendNickname == null || reply.friendNickname == ''">{{reply.friendAccount}}</span>
                                                                    <template v-if=" reply.friendAccount == null || reply.friendAccount == ''">&nbsp;</template>
                                                                </router-link>
                                                                
                                                                <span class="master" v-if="reply.friendAccount != null && reply.friendAccount != '' && reply.friendUserName == state.question.userName && reply.isFriendStaff == state.question.isStaff">作者</span>
                                                            
                                                            </h2>
                                                        </div>
                                                        <span class="ipAddress">
                                                            <template v-if="reply.ipAddress != null && reply.ipAddress != ''">
                                                                    <icon name="map-pin-line" size="14px"/>
                                                                    <span class="ipAddress-text">{{reply.ipAddress}}</span>
                                                                </template>
                                                            <el-dropdown>
                                                                <div class="more">
                                                                    <i class="icon" ><icon name="ellipsis-v-solid" size="14px"/></i>
                                                                </div>
                                                            
                                                                <template #dropdown>
                                                                    <el-dropdown-menu>
                                                                        <el-dropdown-item v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0"  @click="addReplyFriendUI(answer.id,reply.id)"><i class="dropdown-menu-icon" ><icon name="reply" size="15px"/></i> 回复 </el-dropdown-item>
                                                                        
                                                                        <el-dropdown-item v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0" @click="addReportUI(reply.id,60)"><i class="dropdown-menu-icon" ><icon name="error-warning-line" size="15px"/></i> 举报 </el-dropdown-item>
                                                                        
                                                                        
                                                                        <el-dropdown-item v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0 && reply.userName ==  $store.state.systemUser.userName" @click="editReplyUI(reply)"><i class="dropdown-menu-icon" ><icon name="pencil-alt" size="15px"/></i> 编辑 </el-dropdown-item>
                                                                        <el-dropdown-item v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0 && reply.userName ==  $store.state.systemUser.userName" @click="onDeleteReply(reply.id)"><i class="dropdown-menu-icon" ><icon name="trash" size="15px"/></i> 删除 </el-dropdown-item>
                                                                    </el-dropdown-menu>
                                                                </template>
                                                            </el-dropdown>
                                                        </span>
                                                    </div>
                                                    <div style="clear:both; height: 0; line-height: 0; font-size: 0;"></div>
                                                    <div class="replyContent" @click="clickReplyLevel(answer.id,reply.id)">
                                                        <div v-if="reply.account == null || reply.account == ''" class="cancelAccount">此用户账号已注销</div>
                                                        {{reply.content}}
                                                    </div>
                                                    <!-- 修改回复 -->
                                                    <div class="editAnswerReply-formModule" v-show="state.editReplyFormView.get(reply.id)">
                                                        <div class="editReply-wrap">
                                                            <el-form label-position="right" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                                                <el-form-item :error="error.replyContent.get('editReply-'+reply.id)">
                                                                    <el-input type="textarea" :autosize="{minRows: 6}" placeholder="请输入内容" v-model="state.editReplyContentField[index][index2]"></el-input>
                                                                </el-form-item>
                                                                <el-form-item :error="error.captchaValue.get('editReply-'+reply.id)" v-if="state.showCaptcha.get('editReply-'+reply.id)" class="captcha-item">
                                                                    <el-row>
                                                                        <el-col :span="10" >
                                                                            <el-input  v-model="state.captchaValue['editReply-'+reply.id]" @change.native="checkCaptchaValueRules('editReply-'+reply.id)"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                                                <template #prefix>
                                                                                    <Icon name="shield-check-line" size="16px"/>
                                                                                </template>
                                                                            </el-input>
                                                                        </el-col>
                                                                        <el-col :span="8" :offset="1">
                                                                            <el-image :src="state.imgUrl.get('editReply-'+reply.id)" @click="replaceCaptcha('editReply-'+reply.id)"/>
                                                                        </el-col>
                                                                        <el-col :span="4" :offset="1">
                                                                            <el-link type="primary" @click="replaceCaptcha('editReply-'+reply.id)" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                                                        </el-col>
                                                                    </el-row>
                                                                </el-form-item>
                                                                <el-form-item :error="error.reply.get('editReply-'+reply.id)">
                                                                    <el-button class="submitButton" type="primary" @mousedown.native="onEditReply(reply.id)" :disabled="state.allowSubmit.get('editReply-'+reply.id)">提交</el-button>
                                                                    <el-button class="submitButton" type="primary" @mousedown.native="onCancelEditReply(reply.id);" plain >取消</el-button>
                                                                </el-form-item>
                                                            </el-form>
                                                        </div>
                                                    </div>
                                                    <!-- 回复对方 -->
                                                    <div class="addAnswerReplyFriend-formModule" v-show="state.addReplyFriendFormView.get(reply.id)">
                                                        <div class="addReplyFriend-wrap">
                                                            <el-form label-position="right" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                                                <el-form-item :error="error.replyContent.get('addReplyFriend-'+reply.id)">
                                                                    <el-input type="textarea" :autosize="{minRows: 6}" placeholder="请输入内容" v-model="state.addReplyFriendContentField[reply.id]"></el-input>
                                                                </el-form-item>
                                                                <el-form-item :error="error.captchaValue.get('addReplyFriend-'+reply.id)" v-if="state.showCaptcha.get('addReplyFriend-'+reply.id)" class="captcha-item">
                                                                    <el-row>
                                                                        <el-col :span="10" >
                                                                            <el-input  v-model="state.captchaValue['addReplyFriend-'+reply.id]" @change.native="checkCaptchaValueRules('addReplyFriend-'+reply.id)"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                                                <template #prefix>
                                                                                    <Icon name="shield-check-line" size="16px"/>
                                                                                </template>
                                                                            </el-input>
                                                                        </el-col>
                                                                        <el-col :span="8" :offset="1">
                                                                            <el-image :src="state.imgUrl.get('addReplyFriend-'+reply.id)" @click="replaceCaptcha('addReplyFriend-'+reply.id)"/>
                                                                        </el-col>
                                                                        <el-col :span="4" :offset="1">
                                                                            <el-link type="primary" @click="replaceCaptcha('addReplyFriend-'+reply.id)" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                                                        </el-col>
                                                                    </el-row>
                                                                </el-form-item>
                                                                <el-form-item :error="error.reply.get('addReplyFriend-'+reply.id)">
                                                                    <el-button class="submitButton" type="primary" @mousedown.native="onAddReplyFriend(answer.id,reply.id)" :disabled="state.allowSubmit.get('addReplyFriend-'+reply.id)">提交</el-button>
                                                                    <el-button class="submitButton" type="primary" @mousedown.native="onCancelAddReplyFriend(reply.id);" plain >取消</el-button>
                                                                </el-form-item>
                                                            </el-form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div> 

                                
                                <!-- 添加回复 -->
                                <div class="answerReply-formModule" v-show="state.addReplyFormView.get(answer.id)">
                                    <div class="addReply-wrap">
                                        <el-form label-position="right" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                            <el-form-item :error="error.replyContent.get('addReply-'+answer.id)">
                                                <el-input type="textarea" :autosize="{minRows: 6}" placeholder="请输入内容" v-model="state.addReplyContentField[index]"></el-input>
                                            </el-form-item>
                                            <el-form-item :error="error.captchaValue.get('addReply-'+answer.id)" v-if="state.showCaptcha.get('addReply-'+answer.id)" class="captcha-item">
                                                <el-row>
                                                    <el-col :span="10" >
                                                        <el-input  v-model="state.captchaValue['addReply-'+answer.id]" @change.native="checkCaptchaValueRules('addReply-'+answer.id)"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                            <template #prefix>
                                                                <Icon name="shield-check-line" size="16px"/>
                                                            </template>
                                                        </el-input>
                                                    </el-col>
                                                    <el-col :span="8" :offset="1">
                                                        <el-image :src="state.imgUrl.get('addReply-'+answer.id)" @click="replaceCaptcha('addReply-'+answer.id)"/>
                                                    </el-col>
                                                    <el-col :span="4" :offset="1">
                                                        <el-link type="primary" @click="replaceCaptcha('addReply-'+answer.id)" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                                    </el-col>
                                                </el-row>
                                            </el-form-item>
                                            <el-form-item :error="error.reply.get('addReply-'+answer.id)">
                                                <el-button class="submitButton" type="primary" @mousedown.native="onAddReply(answer.id)" :disabled="state.allowSubmit.get('addReply-'+answer.id)">提交</el-button>
                                                <el-button class="submitButton" type="primary" @mousedown.native="onCancelAddReply(answer.id);" plain >取消</el-button>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                                <!-- 修改答案表单 -->
                                <div class="editAnswer-formModule" v-show="state.editAnswerFormView.get(answer.id)">
                                    <div class="editAnswer-wrap">
                                        <div class="head"><Icon name="pencil-alt" size="50px" class="icon"/></div>
                                        <el-form label-position="right" :ref="'formEditAnswerRef-'+answer.id" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                            <el-form-item :error="error.content.get('editAnswer-'+answer.id)">
                                                
                                                <div v-show="!state.isEditAnswerMarkdownMap.get(answer.id)" style="width: 100%;">
                                                    <textarea :ref="handleEditAnswerNodes" :editorId="'editAnswer_'+answer.id" :answerId="answer.id" style="width:100%;height:230px;visibility:hidden;"></textarea>
                                                </div>
                                                <div v-if="state.isEditAnswerMarkdownMap.get(answer.id)" style="width: 100%;">
                                                    <Editor mode="split" :editorId="'editAnswer_'+answer.id" :value="(state.editAnswerMarkdownContent[answer.id] as string)" :plugins="state.editAnswerEditorPlugin" :locale="zhHans" :sanitize="answerSanitize" placeholder="请输入内容..." @change="handleEditAnswerMarkdownChange($event,answer.id)"/>
                                                </div>
                                            </el-form-item>
                                            <el-form-item :error="error.captchaValue.get('editAnswer-'+answer.id)" v-if="state.showCaptcha.get('editAnswer-'+answer.id)" class="captcha-item">
                                                <el-row>
                                                    <el-col :span="10" >
                                                        <el-input  v-model="state.captchaValue['editAnswer-'+answer.id]" @change.native="checkCaptchaValueRules('editAnswer-'+answer.id)"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                            <template #prefix>
                                                                <Icon name="shield-check-line" size="16px"/>
                                                            </template>
                                                        </el-input>
                                                    </el-col>
                                                    <el-col :span="8" :offset="1">
                                                        <el-image :src="state.imgUrl.get('editAnswer-'+answer.id)" @click="replaceCaptcha('editAnswer-'+answer.id)"/>
                                                    </el-col>
                                                    <el-col :span="4" :offset="1">
                                                        <el-link type="primary" @click="replaceCaptcha('editAnswer-'+answer.id)" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                                    </el-col>
                                                </el-row>
                                            </el-form-item>
                                            <el-form-item :error="error.answer.get('editAnswer-'+answer.id)" class="form-action">
                                                <el-button class="submitButton" type="primary"  @mousedown.native="onEditAnswerFormSubmit(answer.id)" :disabled="state.allowSubmit.get('editAnswer-'+answer.id)">提交</el-button>
                                                <el-button class="submitButton" type="primary"  @mousedown.native="onCancelEditAnswer(answer.id)" plain>取消</el-button>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                                 
                                <div class="tipBottom">
                                    <span class="a-toolbar">
                                        <span class="ipAddress-text" v-if="answer.ipAddress != null && answer.ipAddress != ''">
                                            <Icon name="map-pin-line" size="15px" class="icon"/>{{answer.ipAddress}}
                                        </span>
                                        <a v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0 && state.question.userName ==  $store.state.systemUser.userName && Long.fromString(state.question.adoptionAnswerId).eq(0)" @click="adoptionAnswer(answer.id)" >
                                            <Icon name="check-circle-solid" size="15px" class="icon"/>采纳
                                        </a>
                                        
                                        <a v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0" @click="addReplyUI(answer.id)" >
                                            <Icon name="reply" size="15px" class="icon"/>回复
                                        </a>

                                        <span class="report" v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0" @click="addReportUI(answer.id,50)">
                                            <span><Icon name="error-warning-line" size="15px" class="icon"/>举报</span>
                                        </span>
                                        
                                        <a v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0 && answer.userName ==  $store.state.systemUser.userName && answer.adoption == false" @click="editAnswerUI(answer)">
                                            <Icon name="pencil-alt" size="15px" class="icon"/>编辑
                                        </a>
                                        
                                        <a v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0 && answer.userName ==  $store.state.systemUser.userName" @click="onDeleteAnswer(answer.id)">
                                            <Icon name="trash" size="15px" class="icon"/>删除
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </ol>
                        <el-skeleton :loading="state.answer_loading" style="padding-top: 25px;"></el-skeleton>
                        <div class="page" v-if="state.isShowPage">
                            <el-pagination background @current-change="handlePage" :current-page="state.currentpage"  :page-size="state.maxresult" :total="state.totalrecord" layout="total, prev, pager, next,jumper" />
                        </div>
                    </div>

                    <!-- 添加举报 -->
                    <el-dialog title="举报" v-model="state.addReportFormView" width="612px" :draggable="true" :close-on-click-modal="false">
                        <div class="addReport-formModule" >
                            <div class="addReport-wrap">
                                <el-form label-position="right" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                    <el-form-item :error="error.reportTypeId">
                                        <div class="reportType-container">
                                            
                                                <div class="reportType-group" v-for="reportType in state.reportTypeList">
                                                    
                                                    <!--  仅有一级分类 -->
                                                    <div v-if="reportType.childType.length ==0">
                                                        <ul class="reportType-list">
                                                            <li class="reportType-item">
                                                                <el-radio-group v-model="state.reportTypeId" @change="selectReportType(state.reportTypeList)">
                                                                <el-radio :label="reportType.id" size="large">{{reportType.name}}</el-radio>
                                                            </el-radio-group>
                                                            </li>
                                                        </ul>
                                                        
                                                    </div>
                                                    <div v-else><!-- 含有多级分类 -->
                                                        <p class="reportType-name">{{reportType.name}}</p>
                                                        <ul class="reportType-list">
                                                            <el-radio-group v-model="state.reportTypeId" @change="selectReportType(state.reportTypeList)">
                                                            <li class="reportType-item" v-for="childReportType in reportType.childType">
                                                                <el-radio :label="childReportType.id" size="large">{{childReportType.name}}</el-radio>
                                                            </li>
                                                        </el-radio-group>
                                                        </ul>
                                                    </div>
                                                </div>
                                            
                                        </div>
                                    </el-form-item>
                                    <el-form-item v-if="state.show_giveReason" :error="error.reason">
                                        <el-input type="textarea" :autosize="{minRows: 5}" placeholder="请填写举报理由" v-model="state.reason"></el-input>
                                    </el-form-item>
                                    <el-form-item v-if="state.show_giveReason && state.reportMaxImageUpload >0" :error="error.imageFile">
                                        <el-upload ref="selectImage" v-model:file-list="state.fileList" action="#" :auto-upload="false" list-type="picture-card" :on-preview="openImagePreview" :on-exceed="onImageExceed" :accept="'.jpg,.jpeg,.gif,.png,.bmp'" :limit="state.reportMaxImageUpload">
                                            <el-icon><Plus /></el-icon>
                                        </el-upload>
                                        <!-- 图片预览 -->
                                        <el-image-viewer v-if="state.isImageViewer" @close="closeImagePreview" :url-list="[state.localImageUrl]" />

                                    </el-form-item>
                                    <el-form-item :error="error.captchaValue.get('report')" v-if="state.showCaptcha.get('report')" class="captcha-item">
                                        <el-row>
                                            <el-col :span="10" >
                                                <el-input  v-model="state.captchaValue['report']" @change.native="checkCaptchaValueRules('report')"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                    <template #prefix>
                                                        <Icon name="shield-check-line" size="16px"/>
                                                    </template>
                                                </el-input>
                                            </el-col>
                                            <el-col :span="8" :offset="1">
                                                <el-image :src="state.imgUrl.get('report')" @click="replaceCaptcha('report')"/>
                                            </el-col>
                                            <el-col :span="4" :offset="1">
                                                <el-link type="primary" @click="replaceCaptcha('report')" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                    <el-form-item :error="error.report">
                                        <el-button class="submitButton" type="primary" @mousedown.native="onAddReportFormSubmit" :disabled="state.allowSubmit.get('report')">提交</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        
                    </el-dialog>
                </div>

                <div class="right">
                    <div class="affix-container">
                        <el-affix target=".affix-container" :offset="state.affix_offset" z-index="1" @scroll="onRightScroll">
                            <div class="right-container" ref="right_ref">
                                <div class="userInfo-wrap clearfix" v-if="state.question == undefined || state.question == null  || Object.keys(state.question).length==0" >
                                    <div class="userInf" style="padding: 20px 20px;">
                                        <el-skeleton :loading="state.question_loading"></el-skeleton>
                                    </div>
                                </div>
                                <!-- 问题用户信息 -->
                                <div class="userInfo-wrap clearfix" v-if="state.question != undefined && state.question != null && Object.keys(state.question).length>0">
                                    <div class="userInfo">
                                        <div class="author">
                                            <router-link tag="a" v-if="state.question.userName != null && state.question.userName != ''" :to="{path:'/user/control/home',query: {userName: state.question.userName}}" target="_blank">
                                                <img v-if="state.question.avatarName != null" :src="state.question.avatarPath+'100x100/'+state.question.avatarName" class="img">
                                                <img v-if="state.question.avatarName == null" :src="state.question.avatar" width="70" height="70" class="img"/>
                                                
                                            </router-link>
                                            <a v-if="state.question.userName == null || state.question.userName == ''">
                                                <img :src="state.question.avatar" width="70" height="70" class="img"/>  
                                            </a>
                                        </div>
                                        <p class="name">
                                            <router-link tag="a" :to="{path:'/user/control/home',query: {userName: state.question.userName}}" target="_blank">
                                                {{state.question.nickname != null && state.question.nickname != '' ?state.question.nickname : state.question.account}}
                                            </router-link>
                                        </p>
                                        <div class="role" v-if="state.question.userRoleNameList != null && state.question.userRoleNameList.length >0">
                                            <i class="userRoleName" v-for="roleName in state.question.userRoleNameList">{{roleName}}</i>
                                        </div>
                                        
                                        <div class="role" v-if="state.question.isStaff">
                                            <i class="staff">官方人员</i>	
                                        </div>
                                        <ul>
                                            <li>
                                                <span v-if="Long.fromString(state.answerCount).gt(999999)">{{state.answerCount}}+</span>
                                                <span v-if="Long.fromString(state.answerCount).lte(999999)">{{state.answerCount}}</span>
                                                <span>回答</span>
                                            </li>
                                            <li>
                                                <span v-if="Long.fromString(state.followerCount).gt(999999)">{{state.followerCount}}+</span>
                                                <span v-if="Long.fromString(state.followerCount).lte(999999)">{{state.followerCount}}</span>
                                                <span>粉丝</span>
                                            </li>
                                            <li>
                                                <span v-if="Long.fromString(state.followCount).gt(999999)">{{state.followCount}}+</span>
                                                <span v-if="Long.fromString(state.followCount).lte(999999)">{{state.followCount}}</span>
                                                <span>关注</span>
                                            </li>
                                        </ul>
                                        <div class="action-button" v-if="!state.question.isStaff && state.question.userName != null && state.question.userName != ''">
                                            <!-- 关注用户 -->
                                            <span class="action-followBox" >
                                                <el-button type="primary" @click="addFollow(state.question.userName)">{{state.followText}}</el-button>
                                            </span>
                                            <span class="privateMessageBox" >
                                                <el-button type="primary" plain @click="toPrivateMessage(state.question.userName)">发私信</el-button>
                                            </span>
                                        </div>
                                        
                                    </div>
                                </div>
                                <!--  相似问题 集合 -->
                                <div class="likeQuestionModule clearfix" v-if="state.likeQuestionList != null && state.likeQuestionList.length >0">
                                    <div class="likeQuestion">
                                        <div class="title">相关问题</div>
                                        <ul class="questionList">
                                            <li class="question-title " v-for="likeQuestion in state.likeQuestionList">
                                                <router-link tag="a" :to="{path: '/question', query:{ questionId : likeQuestion.id}}">
                                                    {{likeQuestion.title}}
                                                </router-link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </el-affix>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 回到顶部 -->
    <el-backtop :bottom="100" :visibility-height="100">
        <div>
            <Icon name="back-to-top" size="16px" />
        </div>
    </el-backtop>

    <!-- 页脚 -->
    <Footer/>
</template>

<script lang="ts" setup>
    import { onMounted, ref ,nextTick, getCurrentInstance, ComponentInternalInstance, reactive, onUnmounted, computed, onUpdated, watchEffect, watch,} from 'vue'
    import { ElImage, ElMessage, ElMessageBox, UploadFile, UploadUserFile} from 'element-plus'
    import { appStore } from "@/store";
    import { useMeta} from 'vue-meta'
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import { PageView,Question, Answer, AnswerReply, ReportType } from "@/types/index";
    import { AxiosResponse } from 'axios';
    import { letterAvatar } from '@/utils/letterAvatar';
    import Icon from "@/components/icon/Icon.vue";
    import Long from "long";
    import { escapeHtml, escapeVueHtml, unescapeHtml } from '@/utils/escape';
    import { getLanguageClassName, processErrorInfo } from '@/utils/tool';
    import { createEditor } from '@/utils/editor';
    import Prism from "prismjs";
    import mermaid from "mermaid";
    import katex from 'katex'
    import 'katex/dist/katex.css'   
    import zhHans from 'bytemd/locales/zh_Hans.json'
    import { markdownPlugins,sanitize } from '@/utils/markdownEditor';
  
    import { toggleEditor } from '@/utils/markdownPlugin/plugin-toggle-editor';
    import { help } from '@/utils/markdownPlugin/plugin-help';
    import { emoji } from '@/utils/markdownPlugin/plugin-emoji';
    import { imageUpload } from '@/utils/markdownPlugin/plugin-image-upload';
    import { pasteImageUpload } from '@/utils/markdownPlugin/plugin-paste-image';
    import { Editor } from '@bytemd/vue-next'
    import type { BytemdPlugin } from 'bytemd'
    import config from '@/utils/markdownPlugin/plugin-config';

    mermaid.mermaidAPI.initialize({ startOnLoad: false });


    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const store = appStore();
    const router = useRouter();

    const formAppendQuestionContentRef = ref()
    const formAddAnswerContentRef = ref()

    const right_ref = ref()

     //问题内容
     const questionRefs = ref({}) as any;

    //html页元信息
    const computedMeta = computed(() => ({ 
        title: store.state.title,
        meta: [
            {
                name: 'keywords',
                content: store.state.keywords
            },{
                name: "description",
                content: store.state.description
            }
        ]
    }))
    const { meta } = useMeta(
        computedMeta
    )
    //监听网站标题
    watchEffect(() => {
        const titleValue = computedMeta.value.title
        if(titleValue != null && titleValue != '' && state.question != null && Object.keys(state.question).length > 0){
            meta.title = (state.question.title != null ? state.question.title : '') +  ' - ' + computed(() => store.state.title).value;		
            meta.meta[0].content = (state.question.title != null ? state.question.title : '') +  ' - ' + computed(() => store.state.title).value;
            meta.meta[1].content = (state.question.title != null ? state.question.title : '') +  ' - ' + computed(() => store.state.title).value;

        }
    }, {
        flush: 'post'//在组件更新后触发，第一次运行需要组件渲染完成才执行
    })

    const state = reactive({
        questionId:'',
        question: {} as Question,
        question_loading:true,//是否显示答案骨架屏
  
       

        alreadyCollected :false,//用户是否已经收藏答案
        favoriteCount : 0,//答案用户收藏总数
        
        answerList:{} as Array<Answer>,
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        answer_loading:true,//是否显示答案骨架屏
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
        
        appendQuestionFormView:false,//是否显示追加问题表单
        appendQuestionEditor :{} as any,//追加问题编辑器
        appendQuestionEditorCreateParameObject :{} as any,//追加问题编辑器的创建参数
        appendQuestionMarkdownContent:'',//追加问题markdown内容
        isAppendQuestionMarkdown:false,//追加问题是否使用markdown编辑器



        allowAnswer:false,//是否显示答案表单
        fileSystem:0,//文件存储系统
        supportEditor:10,//支持编辑器
        
        addAnswerEditor :{} as any,//添加答案编辑器
        addAnswerEditorCreateParameObject :{} as any,//添加答案编辑器的创建参数
        
        addAnswerMarkdownContent:'',//添加答案markdown内容
        isAddAnswerMarkdown:false,//添加答案是否使用markdown评论编辑器
        
      
        editAnswerFormView : new Map(),//修改答案表单  key:答案Id value:是否显示
        editAnswerEditorMap:new Map(),//修改答案富文本编辑器集合 key:答案Id value:富文本编辑器
        editAnswerEditorCreateParameMap:new Map(),//修改答案编辑器的创建参数 key:答案Id value:编辑器参数对象
        isEditAnswerMarkdownMap: new Map(),//修改答案是否使用markdown编辑器  key:评论Id value:是否为markdown编辑器
        editAnswerMarkdownContent : {} as any,//修改答案markdown编辑内容 key:评论Id value:评论内容

        isPageCall :false,//是否由分页按钮调用


		editAnswerElementNodes:[] as any,//修改答案项Element节点集合
		replyElementNodes:[] as any,//回复列表项Element节点集合

        addReplyContentField : [] as any, //添加回复内容项绑定
		addReplyFormView : new Map(),//添加回复表单  key:答案Id value:是否显示

		editReplyContentField : [] as any, //修改回复内容项绑定(二维数组)
		editReplyFormView : new Map(),//修改回复表单  key:回复Id value:是否显示

        showCaptcha:new Map<string,boolean>(),//是否显示验证码  本项及以下几项的key格式为 key:模块+id  例如： 追加问题appendQuestion-问题Id  添加答案key=addAnswer-问题Id   修改答案key=editAnswer-答案Id    添加回复key=addReply-答案Id   修改回复key=editReply-回复Id
        captchaKey: new Map<string,string>(),//验证码key
        captchaValue: {} as any,//验证码值
        imgUrl: new Map<string,string>(),//验证码图片
        allowSubmit:new Map<string,boolean>(),//提交按钮disabled状态

        followerCount:'0',//粉丝总数
        followText:'关注',//关注文本
        answerCount:'0',//回答总数
        followCount:'0',//关注总数

       
        
        likeQuestionList:[] as Array<Question>, //相似问题集合

        addReportFormView:false,//举报表单
        reportTypeId : ''as string,//举报分类Id
        reason : ''as string,//举报理由
        fileList : [] as UploadUserFile[],//上传表单图片列表
        parameterId : '' as string,//举报参数Id
		module: 0 as number,//举报模块
        reportTypeList:[] as Array<ReportType>,//举报分类列表
        reportMaxImageUpload: 0 as number,//图片允许最大上传数量
        show_giveReason:false,//是否显示说明理由表单   

        localImageUrl: '' as string | undefined,//本地图片地址 例如blob:http://127.0.0.1:8080/cfab3833-cbb0-4072-a576-feaf8fb19e5f
        isImageViewer: false,//是否显示图片查看器

        addReplyFriendContentField : {} as any, //添加回复对方内容项绑定 key:回复Id value:内容 示例{回复Id-1 : 内容,回复Id-2 : 内容}
		addReplyFriendFormView : new Map(),//添加回复对方表单  key:回复Id value:是否显示
        line : new Map(),//楼中楼的线  key:回复Id value:是否显示
        dot : new Map(),//楼中楼的点  key:回复Id value:是否显示

        affix_offset:10,//固钉偏移距离


        appendQuestionEditorPlugin:[] as BytemdPlugin[],//追加问题Markdown编辑器插件
        addAnswerEditorPlugin:[] as BytemdPlugin[],//添加答案Markdown编辑器插件
        editAnswerEditorPlugin:[] as BytemdPlugin[],//修改答案Markdown编辑器插件
    });

     //错误
     const error = reactive({
        appendQuestionContent: '',
		question: '',


        content : new Map<string,string>(),//答案内容错误
       // quoteContent : new Map<string,string>(),
        replyContent: new Map<string,string>(),//回复内容错误
        captchaValue : new Map<string,string>(),
        answer: new Map<string,string>(),//答案错误
      //  quote: new Map<string,string>(),
        reply: new Map<string,string>(),//回复错误
        
        reportTypeId:'',//举报分类Id
        reason:'',//举报理由
        imageFile:'',//举报图片
        report:''//举报

    })


    //答案ref节点处理
    const handleEditAnswerNodes = (el: any) => {
        if(el != null){
            state.editAnswerElementNodes.push(el);
        }
    }
    //回复ref节点处理
	const handleReplyNodes = (el: any) => {
        if(el != null){
            state.replyElementNodes.push(el);
        }
	}

    //处理追加问题Markdown
    const handleAppendQuestionMarkdownChange = (value: string) => {
        state.appendQuestionMarkdownContent = value;
    }

    //追加问题白名单
    const appendQuestionSanitize = (schema: any) => {
        schema = sanitize(schema);
        return schema;
    }

    //追加问题处理切换到富文本编辑器
    const handleAppendQuestionToggleRichtextEditor = (editorId: string) => {
        state.isAppendQuestionMarkdown = false;
        nextTick(()=>{
            if (Object.keys(state.appendQuestionEditorCreateParameObject).length != 0) {//不等于空
                //创建富文本编辑器
                state.appendQuestionEditor = createEditor(
                    state.appendQuestionEditorCreateParameObject.ref, 
                    state.appendQuestionEditorCreateParameObject.availableTag, 
                    state.appendQuestionEditorCreateParameObject.uploadPath, 
                    state.appendQuestionEditorCreateParameObject.userGradeList,
                    state.fileSystem,
                    ()=>{
                        handleAppendQuestionToggleMarkdownEditor(editorId);
                    }
                );
            }
        })
        
        
    }

    //追加问题处理切换到Markdown编辑器
    const handleAppendQuestionToggleMarkdownEditor = (editorId: string) => {
        
        if (Object.keys(state.appendQuestionEditor).length != 0) {//不等于空
			state.appendQuestionEditor.remove();
            state.appendQuestionEditor = {};
		}
        state.isAppendQuestionMarkdown = true;
    }




    //处理添加答案Markdown
    const handleAddAnswerMarkdownChange = (value: string) => {
        state.addAnswerMarkdownContent = value;
    }

    //答案白名单
    const answerSanitize = (schema: any) => {
        schema = sanitize(schema);
        return schema;
    }


     //处理添加答案切换到富文本编辑器
     const handleAddAnswerToggleRichtextEditor = (editorId: string) => {
        state.isAddAnswerMarkdown = false;
        nextTick(()=>{
            if (Object.keys(state.addAnswerEditorCreateParameObject).length != 0) {//不等于空
                //创建富文本编辑器
                state.addAnswerEditor = createEditor(
                    state.addAnswerEditorCreateParameObject.ref, 
                    state.addAnswerEditorCreateParameObject.availableTag, 
                    state.addAnswerEditorCreateParameObject.uploadPath, 
                    state.addAnswerEditorCreateParameObject.userGradeList,
                    state.fileSystem,
                    ()=>{
                        handleAddAnswerToggleMarkdownEditor(editorId);
                    }
                );
            }
        })
    }

    //处理添加答案切换到Markdown编辑器
    const handleAddAnswerToggleMarkdownEditor = (editorId: string) => {
        if (Object.keys(state.addAnswerEditor).length != 0) {//不等于空
            state.addAnswerEditor.remove();
            state.addAnswerEditor = {};
        }
        state.isAddAnswerMarkdown = true;
    }



    //处理修改答案Markdown
    const handleEditAnswerMarkdownChange = (value: string, answerId: string) => {
       Object.assign(state.editAnswerMarkdownContent, {[answerId] : value});
    }


    //查询问题
    const queryQuestion = (questionId: string,callback :any) => {
		proxy?.$axios({
            url: '/question',
            method: 'get',
            params:  { 
                questionId: questionId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: Question) => {
            if(data){
                                            
                //处理自定义标签
                let contentNode = document.createElement("div");
                contentNode.innerHTML = data.content;
                bindNode(contentNode);
                
                data.content = escapeVueHtml(contentNode.innerHTML);


                if(data.appendQuestionItemList != null && data.appendQuestionItemList.length >0){
                    for(let i=0; i<data.appendQuestionItemList.length; i++){
                        let appendQuestionItem = data.appendQuestionItemList[i];
                        
                        //处理图片放大标签
                        let contentNode2 = document.createElement("div");
                        contentNode2.innerHTML = appendQuestionItem.content;
                        bindNode(contentNode2);
                        appendQuestionItem.content = escapeVueHtml(contentNode2.innerHTML);
                    }
                    
                }

                
                state.question = data;

                if(state.question.nickname != null && state.question.nickname !=''){
                    state.question.avatar = letterAvatar(state.question.nickname, 70);
                }else{
                    state.question.avatar = letterAvatar(state.question.account, 70);
                }


                nextTick(()=>{
                    //渲染代码
                    let questionRefValue = questionRefs.value['question_'+state.questionId]
                    if(questionRefValue != undefined){
                        renderBindNode(questionRefValue); 
                    }

                    if(data.appendQuestionItemList != null && data.appendQuestionItemList.length >0){
                        for(let i=0; i<data.appendQuestionItemList.length; i++){
                            let appendQuestionItem = data.appendQuestionItemList[i];
                            
                            let appendQuestionRefValue = (proxy?.$refs['appendQuestion_'+appendQuestionItem.id] as any);
                            if(appendQuestionRefValue != undefined){
                                renderBindNode(appendQuestionRefValue[0]); 
                            }
                        }
                        
                    }
                    
                });
                
                //回调
                callback();

                

            }
            state.question_loading = false;//是否显示问题骨架屏
        })
        .catch((error: any) =>{
            console.log(error);
        });
	}

    //递归绑定节点参数
    const bindNode = (node:any) => {
        
        
        //先找到子节点
        let nodeList = node.childNodes;
        for(let i = 0;i < nodeList.length;i++){
            //childNode获取到到的节点包含了各种类型的节点
            //但是我们只需要元素节点  通过nodeType去判断当前的这个节点是不是元素节点
            let childNode = nodeList[i];
            let random = Math.random().toString().slice(2);
            //判断是否是元素节点。如果节点是元素(Element)节点，则 nodeType 属性将返回 1。如果节点是属性(Attr)节点，则 nodeType 属性将返回 2。
            if(childNode.nodeType == 1){

                //处理图片
                if(childNode.nodeName.toLowerCase() == "img" ){
                    let src = childNode.getAttribute("src");
                    
                    childNode.removeAttribute("src");//将原节点src属性删除，防止多请求一次
                
                    let html = '';
                    let style = '';
                    if(childNode.getAttribute("width") != null){//如果是表情，表情图不放大
                        style = 'style="width: '+childNode.getAttribute("width")+'; height: '+childNode.getAttribute("height")+'"';
                        html = '<el-image src="'+store.state.apiUrl+src+'" '+style+' loading="lazy" ></el-image>';
                    }else{
                    
                        html = '<el-image src="'+src+'" '+style+' :preview-src-list=["'+src+'"] lazy hide-on-click-modal ></el-image>';
                    }
                    //创建要替换的元素
                //	let html = '<el-image src="'+src+'" '+style+' lazy></el-image>';
                //	let html = '<el-image src="'+src+'" '+style+' :preview-src-list=["http://127.0.0.1:8080/cms/common/tttttt/templates.jpg"] lazy hide-on-click-modal ></el-image>';
                    
                
                
                //	let html = '<el-image src="backstage/images/null.gif" lazy></el-image>';
                    let placeholder = document.createElement('div');
                    placeholder.innerHTML = html;
                    let node = placeholder.childNodes[0];
                //	node.setAttribute("src",src);
                    childNode.parentNode.replaceChild(node,childNode);//替换节点	 
                }
                
                //处理表格 (解决Chrome内核浏览器DPI缩放比例高于100%时部分边框变粗问题，需要CSS配合)
                if(childNode.nodeName.toLowerCase() == "table" ){
                    childNode.removeAttribute("border");
                    childNode.removeAttribute("bordercolor");
                }

               //处理代码标签
                if(childNode.nodeName.toLowerCase() == "pre" ){

                    
                    let firstChildNode = null;//第一个子节点

                    for(let p = 0;p < childNode.childNodes.length;p++){
                        let preChildNode = childNode.childNodes[p];
                        if(preChildNode.nodeName.toLowerCase() == "code" ){
                            firstChildNode = preChildNode;
                            break;
                        }
                    }
                    
                    if(firstChildNode != null && firstChildNode.getAttribute("class")!= null && firstChildNode.getAttribute("class").indexOf("language-") != -1){//Markdown代码
                        
                        let class_val = firstChildNode.className;
                        let lan_class = "";
                        let class_arr = new Array();
                        class_arr = class_val.split(' ');
                        
                        for(let k=0; k<class_arr.length; k++){
                            let className = class_arr[k].trim();
                            
                            if(className != null && className != ""){
                                if (className.lastIndexOf('language-', 0) === 0) {
                                    lan_class = className;
                                    break;
                                }
                            }
                        }
                        if(firstChildNode.getAttribute("class").indexOf("language-mermaid") == -1){
                            childNode.className = "line-numbers "+lan_class;
                            childNode.setAttribute("data-prismjs-copy","复制");
                            childNode.setAttribute("data-prismjs-copy-error","按Ctrl+C复制");
                            childNode.setAttribute("data-prismjs-copy-success","复制成功");


                            let nodeHtml = "";

                            //删除code节点
                            let preChildNodeList = childNode.childNodes;
                            for(let p = 0;p < preChildNodeList.length;p++){
                                let preChildNode = preChildNodeList[p];
                                if(preChildNode.nodeName.toLowerCase() == "code" ){
                                    nodeHtml += preChildNode.innerHTML;
                                    preChildNode.parentNode.removeChild(preChildNode);
                                }
                                
                            }
                            
                            let dom = document.createElement('code');
                            dom.className = "line-numbers "+lan_class;
                            dom.innerHTML=nodeHtml;
                            
                        
                            childNode.appendChild(dom);
                        }
                    }


                    if(childNode.className != null && childNode.className.indexOf("lang-") != -1){//富文本编辑器代码
                       
                        let pre_html = childNode.innerHTML;
                        let class_val = childNode.className;
                        let lan_class = "";
                        
                        let class_arr = new Array();
                        class_arr = class_val.split(' ');
                        
                        for(let k=0; k<class_arr.length; k++){
                            let className = class_arr[k].trim();
                            
                            if(className != null && className != ""){
                                if (className.lastIndexOf('lang-', 0) === 0) {
                                    lan_class = className;
                                    break;
                                }
                            }
                        }
                        
                        childNode.className = "line-numbers "+getLanguageClassName(lan_class);
                        childNode.setAttribute("data-prismjs-copy","复制");
                        childNode.setAttribute("data-prismjs-copy-error","按Ctrl+C复制");
                        childNode.setAttribute("data-prismjs-copy-success","复制成功");


                        let nodeHtml = "";

                        //删除code节点
                        let preChildNodeList = childNode.childNodes;
                        for(let p = 0;p < preChildNodeList.length;p++){
                            let preChildNode = preChildNodeList[p];
                            if(preChildNode.nodeName.toLowerCase() == "code" ){
                                nodeHtml += preChildNode.innerHTML;
                                preChildNode.parentNode.removeChild(preChildNode);
                            }
                            
                        }
                        
                        let dom = document.createElement('code');
                        dom.className = "line-numbers "+getLanguageClassName(lan_class);
                        dom.innerHTML=nodeHtml;
                        
                    
                        childNode.appendChild(dom);
                    }

                    
                    
                   
                }
                
                bindNode(childNode);

                
            }
        }
    }
    //查询答案列表
    const queryAnswerList = (questionId: string,answerId: string, replyId: string, page:number|undefined) => {
        let params = {} as any;
        params.questionId = questionId;
        if(answerId != null && answerId != ''){
            params.answerId = answerId;
        }
        if(page != undefined){
            params.page = page;
        }

        proxy?.$axios({
            url: '/queryAnswerList',
            method: 'get',
            params:  params,
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: PageView<Answer>) => {
            //清空
            state.editAnswerElementNodes.length = 0;

            state.editReplyContentField.length = 0;

          


            state.answerList = {} as Array<Answer>;


            if(data.records != null && data.records.length >0){
                for(let i:number=0; i<data.records.length; i++){
                    let answer = data.records[i];
                    if(answer.nickname != null && answer.nickname !=''){
                        answer.avatar = letterAvatar(answer.nickname, 60);
                    }else{
                        answer.avatar = letterAvatar(answer.account, 60);
                    }

                    if(answer.answerReplyList != null && answer.answerReplyList.length >0){
                        for(let j:number=0; j<answer.answerReplyList.length; j++){
                            let reply = answer.answerReplyList[j];
                            if(reply.nickname != null && reply.nickname !=''){
                                reply.avatar = letterAvatar(reply.nickname, 40);
                            }else{
                                reply.avatar = letterAvatar(reply.account, 40);
                            }

                            if(reply.friendUserName != null && reply.friendUserName != ''){
                                if(reply.friendNickname != null && reply.friendNickname !=''){
                                    reply.friendAvatar = letterAvatar(reply.friendNickname, 40);
                                }else{
                                    reply.friendAvatar = letterAvatar(reply.friendAccount, 40);
                                }
                            }
                        }
                    }
                    


                    //定义回复数组
                    let editReplyContentField_reply_array = [];
                    
                    //回复
                    if(answer.answerReplyList != null && answer.answerReplyList.length >0){
                        for (let j = 0; j <answer.answerReplyList.length; j++) {
                            let reply = answer.answerReplyList[j];
                            state.editReplyFormView.set(reply.id,false);
                            
                            editReplyContentField_reply_array.push(reply.content);
                            
                            
                        }
                    }
                    
                    //二维数组示例
                    //let a=[1,2];
                    //let b=[]; 
                    //b[0]=a;//把数组a作为b数组的元素传入b数组中	 
                    //alert(b[0][1]);//2
                    state.editReplyContentField[i] = editReplyContentField_reply_array;//把数组editReplyContentField_reply_array作为editReplyContentField数组的元素传入editReplyContentField数组中
										
										
										


                    //处理图片放大标签
                    let contentNode = document.createElement("div");
                    contentNode.innerHTML = answer.content;
                    bindNode(contentNode);
                    answer.content = escapeVueHtml(contentNode.innerHTML);

                }
            }



            state.answerList = data.records;
            state.totalrecord = parseInt(data.totalrecord);//服务器返回的long类型已转为String类型
            state.currentpage = data.currentpage;
            state.totalpage = parseInt(data.totalpage);//服务器返回的long类型已转为String类型
            state.maxresult = data.maxresult;

            state.answer_loading = false;//是否显示答案骨架屏
            state.isShowPage = true;//显示分页栏


            nextTick(()=> {
                //跳转到锚点
                
                //跳转到答案
                 if(answerId != null && answerId != '' && (replyId == null || replyId == '')){
                    
                    let answerRef = (proxy?.$refs['answer_'+answerId] as any);
                   
                    if(answerRef !=undefined){
                        let answerRefValue = answerRef[0];
                       // setTimeout(function () {
                            window.scrollTo(0,answerRefValue.getBoundingClientRect().top-60);
                      //  }, 100);
                    }
                }
                
                //跳转到回复
                if(replyId != null && replyId != ''){
                    for(let i = 0; i<state.replyElementNodes.length; i++){
                        let replyElement = state.replyElementNodes[i];
                        let _replyId = replyElement.getAttribute("replyId");
                        if(replyId == _replyId){//跳转到当前回复
                            window.scrollTo(0,replyElement.getBoundingClientRect().top-20);
                            break;
                        }
                    }
                }
                

               
                //分页跳转
                if(state.isPageCall && page != undefined && (answerId == null || answerId == '') && (replyId == null || replyId == '')){
                    let top = (document.querySelector(".answerModule") as any).offsetTop
                    window.scrollTo(0,top-10); //切换路由之后滚动到答案模块
                }
                state.isPageCall = false;

                if(data.records != null && data.records.length > 0){
                    for (let i = 0; i <data.records.length; i++) {
                        let answer = data.records[i];
                        let answerRefValue =  (proxy?.$refs['answerContent_'+answer.id] as any);
                        if(answerRefValue != undefined && answerRefValue[0]){
                            renderBindNode(answerRefValue[0]); 
                        }
                        
                    }
                }
            });
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //分页
    const handlePage = (page: number) => {
           
        state.editAnswerFormView.clear() //修改答案表单
        state.editAnswerEditorMap.clear()//修改答案富文本编辑器集合
        state.editAnswerEditorCreateParameMap.clear()//修改答案编辑器的创建参数


        //标记由分页方法调用
        state.isPageCall = true;

        router.push({
            path: '/question', 
            query:{
                questionId:state.questionId,
                page : page
            }
        });
   
    }

    //递归渲染绑定节点
    const renderBindNode = async (node:any) => {	
         //先找到子节点
         let nodeList = node.childNodes;
        for(let i = 0;i < nodeList.length;i++){
            //childNode获取到到的节点包含了各种类型的节点
            //但是我们只需要元素节点  通过nodeType去判断当前的这个节点是不是元素节点
            let childNode = nodeList[i];
            let random = Math.random().toString().slice(2);
            //判断是否是元素节点。如果节点是元素(Element)节点，则 nodeType 属性将返回 1。如果节点是属性(Attr)节点，则 nodeType 属性将返回 2。
            if(childNode.nodeType == 1){
                //处理代码标签
                if(childNode.nodeName.toLowerCase() == "pre" ){
                    let firstChildNode:any = null;//第一个子节点
                    for(let p = 0;p < childNode.childNodes.length;p++){
                        let preChildNode = childNode.childNodes[p];
                        if(preChildNode.nodeName.toLowerCase() == "code" ){
                            firstChildNode = preChildNode;
                            break;
                        }
                    }
                   
                    if(firstChildNode != null && firstChildNode.getAttribute("class")!= null){
                        if(firstChildNode.getAttribute("class") != null && firstChildNode.getAttribute("class").indexOf("language-mermaid") != -1){
                           
                            if(firstChildNode.innerHTML){
                            //  const { svg } = await mermaid.render('mermaid_'+random, unescapeHtml(firstChildNode.innerHTML));

                              //  childNode.innerHTML = svg;

                              const mermaid_container = document.createElement('div')
                                mermaid_container.style.lineHeight = 'initial' //重置行高

                                childNode.replaceWith(mermaid_container);
                                mermaid.render(
                                    'mermaid_'+random,
                                    unescapeHtml(firstChildNode.innerHTML),
                                    // @ts-ignore
                                    mermaid_container
                                ).then((svgCode) => {
                                    // @ts-ignore
                                    mermaid_container.innerHTML = svgCode.svg
                                
                                })
                                .catch((err) => {
                                // console.error(err);
                                })
                            }
                        }else if(firstChildNode.getAttribute("class").indexOf("language-mermaid") != -1){
                            
                        }else{
                            Prism.highlightAllUnder(childNode);
                        }
                    }
                   
                    
                   
                }else if(childNode.nodeName.toLowerCase() == "span"){
                    if(childNode.getAttribute("class") != null && childNode.getAttribute("class").indexOf("math-inline") != -1 && childNode.childNodes.length==1 && childNode.childNodes[0].nodeType ==3){
                        let tex = katex.renderToString(unescapeHtml(childNode.innerHTML), {
                            throwOnError: false,
                            displayMode:false//内联模式
                        });
                        childNode.innerHTML = tex;
                    }
                }else if(childNode.nodeName.toLowerCase() == "div"){
                    if(childNode.getAttribute("class") != null && childNode.getAttribute("class").indexOf("math-display") != -1 && childNode.childNodes.length==1 && childNode.childNodes[0].nodeType ==3){
                        let tex = katex.renderToString(unescapeHtml(childNode.innerHTML), {
                            throwOnError: false,
                            displayMode:true//块模式
                        });
                        childNode.innerHTML = tex;

                    }
                }
                renderBindNode(childNode);
            }
        }
    }

    //添加收藏
    const addFavorite = (questionId:string) => {
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            ElMessage({
                showClose: true,
                message: '请先登录再加入收藏',
                type: 'info',
            })
            return;
        }
        if(state.alreadyCollected){
            return;
        }

        let formData = new FormData();
        formData.append('questionId', questionId);

        proxy?.$axios({
            url: '/user/control/favorite/add',
            method: 'post',
            data: formData
        })
        .then((response: AxiosResponse) => {
            if(response){

                const result: any = response.data;
            
                if(JSON.parse(result.success)){
                    ElMessage({
                        showClose: true,
                        message: '加入收藏成功',
                        type: 'success',
                    })
                    queryAlreadyCollected(questionId);
                    queryFavoriteCount(questionId);

                }else{
                    //处理错误信息
                    processErrorInfo(result.error as Map<string,string> , error,()=>{});
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    //用户是否已经收藏问题
    const queryAlreadyCollected = (questionId:string) => {
        proxy?.$axios({
            url: '/queryAlreadyFavoriteQuestion',
            method: 'get',
            params:  { 
                questionId: questionId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                if(JSON.parse(data)){
                    state.alreadyCollected = true;
                }
            }
            
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    //查询问题用户收藏总数
    const queryFavoriteCount = (questionId:string) => {
        proxy?.$axios({
            url: '/queryQuestionFavoriteCount',
            method: 'get',
            params:  { 
                questionId: questionId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                let count = JSON.parse(data);
                state.favoriteCount = count;
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //刷新验证码
    const replaceCaptcha = (key:string) => {
        state.imgUrl.set(key,store.state.baseURL+"captcha/" + state.captchaKey.get(key) + ".jpg?" + Math.random()) 

    }


    //校验验证码
    const checkCaptchaValue = (value: any, callback: any,key:string) => {
        if(state.captchaKey.get(key) != null && state.captchaKey.get(key) != ''){
            if (value === '') {
                return callback('验证码不能为空');
            }else{
                if (value.trim().length < 4) {
                    callback('验证码长度为4个字符')
                } else {   
                    
                    proxy?.$axios({
                        url: '/userVerification',
                        method: 'get',
                        params:  {
                            captchaKey:state.captchaKey.get(key),
                            captchaValue:state.captchaValue[key]
                        }
                    })
                    .then((response: AxiosResponse) => {
                        if(response){
                            const result: any = response.data;
                            if(!JSON.parse(result)){
                                callback('验证码错误')
                            }else{
                                callback();
                            }
                        }
                    }).catch((error: any) =>{
                        console.log(error);
                    });
                }

            }
        }
    } 

    //校验验证码规则
    const checkCaptchaValueRules = (key:string) =>{
        error.captchaValue.set(key,'');
        checkCaptchaValue(state.captchaValue[key].trim(), (err:string)=>{
            if(err != undefined){
                error.captchaValue.set(key,err);
            }
        },key)
    }

    //追加问题表单
    const appendQuestionUI = (questionId: string) => {
        let _key =  "appendQuestion-"+questionId;
        if(state.appendQuestionFormView == true){//如果已打开
            return;
        }
        
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        proxy?.$axios({
            url: '/user/queryAppendQuestion',
            method: 'get',
            params:  {
                questionId: questionId
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                if(data.allowQuestion){
                    state.appendQuestionFormView = true;

                    nextTick(()=>{
                

                        let availableTag = []
                        if(data.availableTag != null && data.availableTag != ''){
                            let availableTagObject = JSON.parse(data.availableTag);//JSON转为对象

                            let flag = false;
                            if(availableTagObject != null && availableTagObject.length >0){
                                for(var i=0; i< availableTagObject.length; i++){
                                    let availableTag = availableTagObject[i];
                                    if(availableTag == "image"){//增加批量插入图片按钮
                                        availableTagObject.splice(i+1, 0, 'multiimage');//在指定索引处插入元素
                                        break;
                                    }
                                }
                            }
                            if(data.supportEditor == 30 || data.supportEditor == 40){
                                availableTagObject.push("toggleEditor");
                            }
                            availableTag = availableTagObject;//编辑器允许使用标签
                        }
                        
                        state.fileSystem = data.fileSystem;//文件存储系统


                        if(data.supportEditor == 20 || data.supportEditor == 40){//支持编辑器 10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                            state.isAppendQuestionMarkdown = true;
                        }


                        if(state.appendQuestionEditorPlugin != null && state.appendQuestionEditorPlugin.length ==0){
                            //添加插件
                            state.appendQuestionEditorPlugin.push(...markdownPlugins);

                            state.appendQuestionEditorPlugin.push(emoji());
                            if(data.supportEditor == 30 || data.supportEditor == 40){//10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                                state.appendQuestionEditorPlugin.push(
                                    toggleEditor((editorId: string)=>{handleAppendQuestionToggleRichtextEditor(editorId)})
                                );
                            }
                            state.appendQuestionEditorPlugin.push(
                                help(availableTag,[])
                            );
                            if(availableTag?.indexOf('image') != -1){
                                state.appendQuestionEditorPlugin.push(
                                    imageUpload("user/control/question/upload?method=upload",'file',data.fileSystem)
                                );
                                state.appendQuestionEditorPlugin.push(
                                    pasteImageUpload("user/control/question/upload?method=upload",'file',data.fileSystem)
                                );
                            }  
                        }

                        if (Object.keys(state.appendQuestionEditorCreateParameObject).length === 0) {//等于空
                            let uploadPath = "user/control/question/upload";
                            if(!state.isAppendQuestionMarkdown){
                                //创建富文本编辑器
                                state.appendQuestionEditor = createEditor(formAppendQuestionContentRef.value, availableTag, uploadPath, null,state.fileSystem,(editorId: string)=>{
                                    handleAppendQuestionToggleMarkdownEditor(editorId);
                                });
                            }
                            
                            state.appendQuestionEditorCreateParameObject = {
                                    ref:formAppendQuestionContentRef.value,
                                    availableTag:availableTag,
                                    uploadPath:uploadPath,
                                    userGradeList:null
                            }

                        }


                        if (data.captchaKey != undefined && data.captchaKey != '') {
                            
                            state.showCaptcha.set(_key,true)
                            state.captchaKey.set(_key,data.captchaKey)
                            Object.assign(state.captchaValue, {[_key] : ''});
                            replaceCaptcha(_key);//刷新验证码
                        }

            
                    })

                    state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                }else{
                    ElMessage({
                        showClose: true,
                        message: '不允许追加提问',
                        type: 'info',
                    })
                }
            }
            
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //追加问题 -- 提交数据
    const onAppendQuestionFormSubmit = () => {
        let _key =  "appendQuestion-"+state.questionId;
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            error.captchaValue.set(_key,'');
            if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){

                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                    checkCaptchaValue(state.captchaValue[_key].trim(), (err:string)=>{
                        if(err != undefined){
                            error.captchaValue.set(_key,err);
                            state.allowSubmit.set(_key,false);//提交按钮disabled状态
                        }else{
                            resolve();
                        }
                    },_key) 
                }else{
                    error.captchaValue.set(_key,"验证码不能为空");
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                }
            }else{
                resolve();
            }
        });

        Promise.all([p1])
            .then(() => {
                //清空所有错误
                error.appendQuestionContent = '';
                error.captchaValue.delete(_key);
                error.question = '';

                let formData = new FormData();
                formData.append('questionId', state.questionId);

                
                if(state.isAppendQuestionMarkdown){
                    formData.append('isMarkdown', state.isAppendQuestionMarkdown.toString());
                    formData.append('markdownContent', state.appendQuestionMarkdownContent);
                }else{
                    if(formAppendQuestionContentRef.value.value != null && formAppendQuestionContentRef.value.value !=''){
                        formData.append('content', formAppendQuestionContentRef.value.value);
                    }
                }

                
                
                if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){
                    //验证码Key
                    formData.append('captchaKey', state.captchaKey.get(_key) as string);
                }
                
                //验证码值
                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                     formData.append('captchaValue', (state.captchaValue[_key] as string).trim());
                }

                proxy?.$axios({
                    url: '/user/control/question/appendQuestion',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){
                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){
                            
                            
                            ElMessage({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })

                            state.appendQuestionMarkdownContent = "";

                            
                            if (Object.keys(state.appendQuestionEditor).length != 0) {//不等于空
                                state.appendQuestionEditor.remove();
                                state.appendQuestionEditor = {};
                               
                            }
                            state.appendQuestionEditorCreateParameObject = {}

                           
                            nextTick(()=>{//需要延迟才能让state.appendQuestionFormView的设置生效
                                state.appendQuestionFormView = false;
                            })
                           
                            
                            //重置表单
                            //formAddCommentRef.value?.resetFields();
                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }

                            queryQuestion(state.questionId,()=>{});

                        }else{
                            //处理错误信息
                            for (const [key, value] of Object.entries(result.error) as [string, string][]){
                                if(key == 'content'){
                                    error.appendQuestionContent = value;
                                }else if(key == 'question'){
                                    error.question = value;
                                }else if(key == 'captchaValue'){
                                    error.captchaValue.set(_key,value);
                                }
                            }

                            if(result.captchaKey != null){
                                state.showCaptcha.set(_key,true);
                                state.captchaKey.set(_key,result.captchaKey);
                                Object.assign(state.captchaValue, {[_key] : ''});
                                replaceCaptcha(_key);
                            }else{
                                state.showCaptcha.set(_key,false);
                            }

                            
                        }
                        state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                    }
                })
                .catch((error: any) =>{
                    console.log(error);
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                });
            }).catch(() => {
                console.log("提交数据错误");
            });

    }
    //取消追加问题
    const onCancelAppendQuestion = () => {
        if(state.appendQuestionEditor != null && Object.keys(state.appendQuestionEditor).length >0){
            state.appendQuestionEditor.remove();
            state.appendQuestionEditor = {};
        }
        if(state.appendQuestionEditorCreateParameObject != null && Object.keys(state.appendQuestionEditorCreateParameObject).length >0){
            state.appendQuestionEditorCreateParameObject = {}

        }
        state.appendQuestionFormView = false;//是否显示追加问题表单
    }

    //查询添加答案页
    const queryAddAnswer = (questionId:string) => {
        let _key =  "addAnswer-"+state.questionId;
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        

        proxy?.$axios({
            url: '/user/queryAddAnswer',
            method: 'get',
            params:  {},
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                state.allowAnswer = data.allowAnswer;

                nextTick(()=>{
                    if(state.question?.allow && data.allowAnswer){
                        let availableTag = [];
                        if(data.availableTag != null && data.availableTag != ''){
                            let availableTagObject = JSON.parse(data.availableTag);//JSON转为对象

                            let flag = false;
                            if(availableTagObject != null && availableTagObject.length >0){
                                for(var i=0; i< availableTagObject.length; i++){
                                    let availableTag = availableTagObject[i];
                                    if(availableTag == "image"){//增加批量插入图片按钮
                                        availableTagObject.splice(i+1, 0, 'multiimage');//在指定索引处插入元素
                                        break;
                                    }
                                }
                            }
                            if(data.supportEditor == 30 || data.supportEditor == 40){
                                availableTagObject.push("toggleEditor");
                            }
                            availableTag = availableTagObject;//答案编辑器允许使用标签
                        }
                        
                        state.fileSystem = data.fileSystem;//文件存储系统
                        state.supportEditor = data.supportEditor;//支持编辑器 10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                        
                        if(state.addAnswerEditorPlugin != null && state.addAnswerEditorPlugin.length ==0){
                            //添加插件
                            state.addAnswerEditorPlugin.push(...markdownPlugins);
                            state.addAnswerEditorPlugin.push(emoji());
                            state.addAnswerEditorPlugin.push(config(false));
                            
                            if(state.supportEditor == 30 || state.supportEditor == 40){//10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                                state.addAnswerEditorPlugin.push(
                                    toggleEditor((editorId: string)=>{handleAddAnswerToggleRichtextEditor(editorId)})
                                );
                            }
                            state.addAnswerEditorPlugin.push(
                                help(availableTag,[])
                            );
                            if(availableTag?.indexOf('image') != -1){
                                state.addAnswerEditorPlugin.push(
                                    imageUpload("user/control/answer/uploadImage?questionId="+state.questionId,'file',state.fileSystem)
                                );
                                state.addAnswerEditorPlugin.push(
                                    pasteImageUpload("user/control/answer/uploadImage?questionId="+state.questionId,'file',state.fileSystem)
                                );
                            }    
                            
                        }

                        if(data.supportEditor == 20 || data.supportEditor == 40){
                            state.isAddAnswerMarkdown = true;
                        }

                        if (data.captchaKey != undefined && data.captchaKey != '') {
                            
                            state.showCaptcha.set(_key,true)
                            state.captchaKey.set(_key,data.captchaKey)
                            Object.assign(state.captchaValue, {[_key] : ''});
                            replaceCaptcha(_key);//刷新验证码
                        }

                        if (Object.keys(state.addAnswerEditorCreateParameObject).length === 0) {//等于空
                            let uploadPath = "user/control/answer/uploadImage?questionId="+state.questionId;
                        
                            if(!state.isAddAnswerMarkdown){
                                //创建富文本编辑器
                                state.addAnswerEditor = createEditor(formAddAnswerContentRef.value, availableTag, uploadPath, null,state.fileSystem,(editorId: string)=>{
                                    handleAddAnswerToggleMarkdownEditor(editorId);
                                });
                            }
                            state.addAnswerEditorCreateParameObject = {
                                ref:formAddAnswerContentRef.value,
                                availableTag:availableTag,
                                uploadPath:uploadPath,
                                userGradeList:null
                            }
                        }
                        
                    }
            
                })
            }
            

        })
        .catch((error: any) =>{
            console.log(error);
        });

    }

    //添加答案 -- 提交数据
    const onAddAnswerFormSubmit = () => {
        let _key =  "addAnswer-"+state.questionId;
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            error.captchaValue.set(_key,'');
            if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){

                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                    checkCaptchaValue(state.captchaValue[_key].trim(), (err:string)=>{
                        if(err != undefined){
                            error.captchaValue.set(_key,err);
                            state.allowSubmit.set(_key,false);//提交按钮disabled状态
                        }else{
                            resolve();
                        }
                    },_key) 
                }else{
                    error.captchaValue.set(_key,"验证码不能为空");
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                }
            }else{
                resolve();
            }
        });

        Promise.all([p1])
            .then(() => {
                //清空所有错误
                error.content.delete(_key);
                error.captchaValue.delete(_key);
                error.answer.delete(_key);

                let formData = new FormData();
                formData.append('questionId', state.questionId);

                
                if(state.isAddAnswerMarkdown){
                    formData.append('isMarkdown', state.isAddAnswerMarkdown.toString());
                    formData.append('markdownContent', state.addAnswerMarkdownContent);
                }else{
                    if(formAddAnswerContentRef.value.value != null && formAddAnswerContentRef.value.value !=''){
                        formData.append('content', formAddAnswerContentRef.value.value);
                    }
                }

                
                
                if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){
                    //验证码Key
                    formData.append('captchaKey', state.captchaKey.get(_key) as string);
                }
                
                //验证码值
                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                     formData.append('captchaValue', (state.captchaValue[_key] as string).trim());
                }

                proxy?.$axios({
                    url: '/user/control/answer/add',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){
                            ElMessage({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })

                            state.addAnswerMarkdownContent = "";



                            if (Object.keys(state.addAnswerEditor).length != 0) {//不等于空
                                //清空字段
                                state.addAnswerEditor.html("");
                                //自动展开内容
                                state.addAnswerEditor.autoExpandContent();
                                //state.addCommentEditor.remove();
                                //state.addCommentEditorCreateParameObject = {};
                            }

                            //重置表单
                            //formAddCommentRef.value?.resetFields();
                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }

                            let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
                
                            queryAnswerList(state.questionId,'','',page);

                        }else{
                            //处理错误信息
                            for (const [key, value] of Object.entries(result.error) as [string, string][]){
                                if(key == 'content'){
                                    error.content.set(_key,value);
                                }else if(key == 'answer'){
                                    error.answer.set(_key,value);
                                }else if(key == 'captchaValue'){
                                    error.captchaValue.set(_key,value);
                                }
                            }

                            if(result.captchaKey != null){
                                state.showCaptcha.set(_key,true);
                                state.captchaKey.set(_key,result.captchaKey);
                                Object.assign(state.captchaValue, {[_key] : ''});
                                replaceCaptcha(_key);
                            }else{
                                state.showCaptcha.set(_key,false);
                            }

                            
                        }
                        state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                    }
                })
                .catch((error: any) =>{
                    console.log(error);
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                });
            }).catch(() => {
                console.log("提交数据错误");
            });


        
    }

    //采纳答案
    const adoptionAnswer = (answerId:string) => {
        ElMessageBox.confirm('确定采纳答案?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
            formData.append('answerId', answerId);

        

            proxy?.$axios({
                url: '/user/control/question/adoptionAnswer',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(JSON.parse(result.success)){
                        ElMessage({
                            showClose: true,
                            message: '采纳当前答案成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
        

                        state.question.adoptionAnswerId = "1";
						
                        let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
            
                        queryAnswerList(state.questionId,'','',page);

                    }else{
                        //处理错误信息
                        processErrorInfo(result.error as Map<string,string> , reactive({}),()=>{});


                        
                    }
                }
            })
            .catch((error: any) =>{
                console.log(error);
            });

        })
        .catch(() => {
            //取消
        })
    }

    //修改答案表单
    const editAnswerUI = (answer: Answer) => {
        let _key =  "editAnswer-"+answer.id;
        if(state.editAnswerFormView.get(answer.id) == true){//如果已打开
            return;
        }
        
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        proxy?.$axios({
            url: '/user/queryEditAnswer',
            method: 'get',
            params:  {
                answerId: answer.id
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            let data =  response.data;
           
            let _answer = data.answer;
            Object.assign(state.editAnswerMarkdownContent, {[_answer.id] : _answer.markdownContent});

            if(data.allowAnswer && _answer != undefined){
                state.editAnswerFormView.set(answer.id,true);

                nextTick(()=>{
               

                    let availableTag = []
                    if(data.availableTag != null && data.availableTag != ''){
                        let availableTagObject = JSON.parse(data.availableTag);//JSON转为对象

                        let flag = false;
                        if(availableTagObject != null && availableTagObject.length >0){
                            for(var i=0; i< availableTagObject.length; i++){
                                let availableTag = availableTagObject[i];
                                if(availableTag == "image"){//增加批量插入图片按钮
                                    availableTagObject.splice(i+1, 0, 'multiimage');//在指定索引处插入元素
                                    break;
                                }
                            }
                        }

                        availableTag = availableTagObject;//编辑器允许使用标签
                    }
                    
                    state.fileSystem = data.fileSystem;//文件存储系统


                    if(state.editAnswerEditorPlugin != null && state.editAnswerEditorPlugin.length ==0){
                        //添加插件
                        state.editAnswerEditorPlugin.push(...markdownPlugins);
                        state.editAnswerEditorPlugin.push(emoji());
                        state.editAnswerEditorPlugin.push(config(true));
                        state.editAnswerEditorPlugin.push(
                            help(availableTag,[])
                        );
                        if(availableTag?.indexOf('image') != -1){
                            state.editAnswerEditorPlugin.push(
                                imageUpload("user/control/answer/uploadImage?questionId="+state.questionId,'file',state.fileSystem)
                            );
                            state.editAnswerEditorPlugin.push(
                                pasteImageUpload("user/control/answer/uploadImage?questionId="+state.questionId,'file',state.fileSystem)
                            );
                        }   
                    }

                    if (data.captchaKey != undefined && data.captchaKey != '') {
                        
                        state.showCaptcha.set(_key,true)
                        state.captchaKey.set(_key,data.captchaKey)
                        Object.assign(state.captchaValue, {[_key] : ''});
                        replaceCaptcha(_key);//刷新验证码
                    }

                    for(let i = 0; i<state.editAnswerElementNodes.length; i++){
						let editAnswerElement = state.editAnswerElementNodes[i];
                        editAnswerElement.value = _answer.content;
                        let _answerId = editAnswerElement.getAttribute("answerId");

                        if(_answerId == answer.id){
                            let uploadPath = "user/control/answer/uploadImage?questionId="+state.questionId;
                
                            if(_answer.isMarkdown != null && _answer.isMarkdown == true){
                                state.isEditAnswerMarkdownMap.set(answer.id,true);
                            }else{
                                state.isEditAnswerMarkdownMap.set(answer.id,false);
                            }
                            if(!state.isEditAnswerMarkdownMap.get(answer.id)){
                                 //创建富文本编辑器
                                let editor = createEditor(editAnswerElement, availableTag, uploadPath, null,state.fileSystem,(editorId: string)=>{});
                                state.editAnswerEditorMap.set(answer.id,editor);

                            }


                           
                            state.editAnswerEditorCreateParameMap.set(answer.id, {
                                    ref:editAnswerElement,
                                    availableTag:availableTag,
                                    uploadPath:uploadPath,
                                    userGradeList:null
                            })

                            break;
                        }
                    }
        
                })

                state.allowSubmit.set(_key,false);;//提交按钮disabled状态
            }else{
                if(!data.allowAnswer){
                    ElMessage({
                        showClose: true,
                        message: '不允许修改答案',
                        type: 'info',
                    })
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    
    //修改答案 -- 提交数据
    const onEditAnswerFormSubmit = (answerId:string) => {
        let _key =  "editAnswer-"+answerId;
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            error.captchaValue.set(_key,'');
            if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){

                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                    checkCaptchaValue(state.captchaValue[_key].trim(), (err:string)=>{
                        if(err != undefined){
                            error.captchaValue.set(_key,err);
                            state.allowSubmit.set(_key,false);//提交按钮disabled状态
                        }else{
                            resolve();
                        }
                    },_key) 
                }else{
                    error.captchaValue.set(_key,"验证码不能为空");
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                }
            }else{
                resolve();
            }
        });

        Promise.all([p1])
            .then(() => {
                //清空所有错误
                error.content.delete(_key);
                error.captchaValue.delete(_key);
                error.answer.delete(_key);

                let formData = new FormData();
                formData.append('answerId', answerId);

                if(state.isEditAnswerMarkdownMap.get(answerId)!= undefined && state.isEditAnswerMarkdownMap.get(answerId) == true){
                    if(state.editAnswerMarkdownContent[answerId] != undefined){
                        formData.append('markdownContent', state.editAnswerMarkdownContent[answerId]);
                    }
                }else{
                    for(let i = 0; i<state.editAnswerElementNodes.length; i++){
                        let editAnswerElement = state.editAnswerElementNodes[i];
                        let _answerId = editAnswerElement.getAttribute("answerId");
                        
                        if(_answerId == answerId){
                            formData.append('content', editAnswerElement.value);
                            break;
                        }
                    }
                }
                

                
                
                if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){
                    //验证码Key
                    formData.append('captchaKey', state.captchaKey.get(_key) as string);
                }
                
                //验证码值
                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                     formData.append('captchaValue', (state.captchaValue[_key] as string).trim());
                }

                proxy?.$axios({
                    url: '/user/control/answer/edit',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){
                            ElMessage({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
                           

                            let editAnswerEditor = state.editAnswerEditorMap.get(answerId);
                            if(editAnswerEditor != null){
                                editAnswerEditor.remove();
                                state.editAnswerEditorMap.delete(answerId);
                                state.editAnswerEditorCreateParameMap.delete(answerId);
                            }

                            if(state.editAnswerMarkdownContent[answerId] != undefined){
                               state.editAnswerMarkdownContent[answerId] = ""
                            }
                           
                            
                            nextTick(()=>{//需要延迟才能让state.editAnswerMarkdownContent[answerId]的设置生效
                                state.editAnswerFormView.set(answerId,false);
                            })

                           


                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }

                            let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
                
                            queryAnswerList(state.questionId,'','',page);

                        }else{
                            //处理错误信息
                            for (const [key, value] of Object.entries(result.error) as [string, string][]){
                                if(key == 'content'){
                                    error.content.set(_key,value);
                                }else if(key == 'answer'){
                                    error.answer.set(_key,value);
                                }else if(key == 'captchaValue'){
                                    error.captchaValue.set(_key,value);
                                }
                            }

                            if(result.captchaKey != null){
                                state.showCaptcha.set(_key,true);
                                state.captchaKey.set(_key,result.captchaKey);
                                Object.assign(state.captchaValue, {[_key] : ''});
                                replaceCaptcha(_key);
                            }else{
                                state.showCaptcha.set(_key,false);
                            }

                            
                        }
                        state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                    }
                })
                .catch((error: any) =>{
                    console.log(error);
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                });
            }).catch(() => {
                console.log("提交数据错误");
            });
    }
    //取消修改答案
    const onCancelEditAnswer = (answerId:string) => {
        let editAnswerEditor = state.editAnswerEditorMap.get(answerId);
        if(editAnswerEditor != null){
            editAnswerEditor.remove();
            state.editAnswerEditorMap.delete(answerId);
            state.editAnswerEditorCreateParameMap.delete(answerId);
        }
        state.editAnswerFormView.set(answerId,false);
    }
    //删除答案
    const onDeleteAnswer = (answerId:string) => {
        ElMessageBox.confirm('确定删除答案?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
            formData.append('answerId', answerId);

        

            proxy?.$axios({
                url: '/user/control/answer/delete',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(JSON.parse(result.success)){
                        ElMessage({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
        
                        
                        let editAnswerEditor = state.editAnswerEditorMap.get(answerId);
                        if(editAnswerEditor != null){
                            editAnswerEditor.remove();
                            state.editAnswerEditorMap.delete(answerId);
                            state.editAnswerEditorCreateParameMap.delete(answerId);
                        }
                        state.editAnswerFormView.set(answerId,false);


                        let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
            
                        queryAnswerList(state.questionId,'','',page);

                    }else{
                        //处理错误信息
                        processErrorInfo(result.error as Map<string,string> , reactive({}),()=>{});


                        
                    }
                }
            })
            .catch((error: any) =>{
                console.log(error);
            });

        })
        .catch(() => {
            //取消
        })
    }

    //选择举报分类
    const selectReportType = (reportTypeList: Array<ReportType>) => {
        nextTick(()=>{
            for(let i =0; i<reportTypeList.length; i++){
                let reportType = reportTypeList[i];
                if(reportType.id == state.reportTypeId && reportType.giveReason){
                    state.show_giveReason = true;
                    return;
                }
                
                for(let j =0; j<reportType.childType.length; j++){
                    let childReportType = reportType.childType[j];
                    if(childReportType.id == state.reportTypeId && childReportType.giveReason){
                        state.show_giveReason = true;
                        return;
                    }
                }
            }
            
            state.show_giveReason = false;   
             
        })
    }

    //打开图片预览
    const openImagePreview = (file: UploadFile) => {
        state.localImageUrl = file.url;
        state.isImageViewer = true;
    }
    //关闭图片预览
    const closeImagePreview= () => {
        state.localImageUrl = '';
        state.isImageViewer = false;
    }

    //当超出限制时
    const onImageExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
        if(state.reportMaxImageUpload >0  && state.fileList.length >= state.reportMaxImageUpload){
            ElMessage({
                showClose: true,
                message: '已达到最大图片允许上传数量',
                type: 'warning',
            })
        }
    }

    //添加举报
    const addReportUI = (parameterId: string,module: number) => {
        let _key =  "report";
        
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        //清空表单
        state.reportTypeList.length = 0;
        state.reportTypeId = '';//举报分类Id
        state.reason = '';//理由
        state.fileList.length = 0;
        state.reportMaxImageUpload = 0;//图片允许最大上传数量
        state.parameterId = '',//举报参数Id
        state.module = 0,//举报模块
        state.show_giveReason = false,//是否显示说明理由表单
        
        
        state.showCaptcha.delete('report');//是否显示验证码
        state.captchaKey.delete('report');//验证码key
        Object.assign(state.captchaValue, {['report'] : ''});//验证码value

        //清空所有错误
        error.reportTypeId= "";//举报分类Id
        error.reason= "";//理由
        error.imageFile = "";
        error.report= "";
        error.captchaValue.delete('report');


        proxy?.$axios({
            url: '/user/queryAddReport',
            method: 'get',
            params:  {
            },
            showLoading: true,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            let data =  response.data;
            if(data.allowReport){
               
                state.parameterId = parameterId;//举报参数Id
				state.module = module;//举报模块

                state.reportTypeList = data.reportTypeList;
                state.reportMaxImageUpload = data.reportMaxImageUpload;

                if(state.reportTypeList != null && state.reportTypeList.length >0){
                    state.addReportFormView = true;
                }else{
                    ElMessage({
                        showClose: true,
                        message: '举报分类没开启',
                        type: 'info',
                    })
                }

                if (data.captchaKey != undefined && data.captchaKey != '') {
                   
                   state.showCaptcha.set(_key,true)
                   state.captchaKey.set(_key,data.captchaKey)
                   Object.assign(state.captchaValue, {[_key] : ''});
                   replaceCaptcha(_key);//刷新验证码
                }
                state.allowSubmit.set(_key,false);;//提交按钮disabled状态
            }else{
                ElMessage({
                    showClose: true,
                    message: '举报功能已关闭',
                    type: 'info',
                })
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //添加举报 -- 提交数据
    const onAddReportFormSubmit = () => {
        let _key =  "report";
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            error.captchaValue.set(_key,'');
            if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){

                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                    checkCaptchaValue(state.captchaValue[_key].trim(), (err:string)=>{
                        if(err != undefined){
                            error.captchaValue.set(_key,err);
                            state.allowSubmit.set(_key,false);//提交按钮disabled状态
                        }else{
                            resolve();
                        }
                    },_key) 
                }else{
                    error.captchaValue.set(_key,"验证码不能为空");
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                }
            }else{
                resolve();
            }
        });

        Promise.all([p1])
            .then(() => {
                //清空所有错误
                error.captchaValue.delete(_key);

                error.reportTypeId= "";//举报分类Id
                error.reason= "";//理由
                error.imageFile = "";
                error.report= "";

                let formData = new FormData();
                

                formData.append("parameterId", state.parameterId);
                formData.append("module", String(state.module));
            
                if(state.reportTypeId){
                    formData.append("reportTypeId", state.reportTypeId);
                }
                
                if(state.reason){
                    formData.append("reason", state.reason);
                }

                //图片
                for(var i=0; i<state.fileList.length; i++){
                    var fileData = state.fileList[i];
                    formData.append("imageFile", fileData.raw!);
                }
                
                if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){
                    //验证码Key
                    formData.append('captchaKey', state.captchaKey.get(_key) as string);
                }
                
                //验证码值
                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                     formData.append('captchaValue', (state.captchaValue[_key] as string).trim());
                }

                proxy?.$axios({
                    url: '/user/control/report/add',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){
                            ElMessage({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
                           

                            state.addReportFormView = false;


                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }
                        }else{
                            //处理错误信息
                            for (const [key, value] of Object.entries(result.error) as [string, string][]){
                                if(key == 'reportTypeId'){
                                    error.reportTypeId = value;
                                }else if(key == 'reason'){
                                    error.reason = value;
                                }else if(key == 'imageFile'){
                                    error.imageFile = value;
                                }else if(key == 'report'){
                                    error.report = value;
                                }else if(key == 'captchaValue'){
                                    error.captchaValue.set(_key,value);
                                }
                            }

                            if(result.captchaKey != null){
                                state.showCaptcha.set(_key,true);
                                state.captchaKey.set(_key,result.captchaKey);
                                Object.assign(state.captchaValue, {[_key] : ''});
                                replaceCaptcha(_key);
                            }else{
                                state.showCaptcha.set(_key,false);
                            }

                            
                        }
                        state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                    }
                })
                .catch((error: any) =>{
                    console.log(error);
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                });
            }).catch(() => {
                console.log("提交数据错误");
            });
    }


    //添加回复对方表单
    const addReplyFriendUI = ( answerId :string, replyId:string) => {
        let _key =  "addReplyFriend-"+replyId;
        if(state.addReplyFriendFormView.get(replyId) == true){//如果已打开
			return;
		}
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态
        

        proxy?.$axios({
            url: '/user/queryAddAnswerReply',
            method: 'get',
            params:  {
                answerId: answerId
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                if(data.allowReply){
                    state.addReplyFriendFormView.set(replyId,true);

                    if (data.captchaKey != undefined && data.captchaKey != '') {
                        
                        state.showCaptcha.set(_key,true)
                        state.captchaKey.set(_key,data.captchaKey)
                        Object.assign(state.captchaValue, {[_key] : ''});
                        replaceCaptcha(_key);//刷新验证码
                    }

                    state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                }else{
                    ElMessage({
                        showClose: true,
                        message: '不允许添加回复',
                        type: 'info',
                    })
                }
            }
            
        })
        .catch((error: any) =>{
            console.log(error);
        });
 
    }
    //取消添加回复对方
    const onCancelAddReplyFriend = (replyId:string) => {
        
        state.addReplyFriendFormView.set(replyId,false);
        
    }

     //添加回复对方
     const onAddReplyFriend = (answerId:string,replyId:string) => {
        let _key =  "addReplyFriend-"+replyId;
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

       

        const p1 = new Promise<void>((resolve, reject) => {
            error.captchaValue.set(_key,'');
            if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){

                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                    checkCaptchaValue(state.captchaValue[_key].trim(), (err:string)=>{
                        if(err != undefined){
                            error.captchaValue.set(_key,err);
                            state.allowSubmit.set(_key,false);//提交按钮disabled状态
                        }else{
                            resolve();
                        }
                    },_key) 
                }else{
                    error.captchaValue.set(_key,"验证码不能为空");
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                }
            }else{
                resolve();
            }
        });

        Promise.all([p1])
            .then(() => {
                //清空所有错误
                error.replyContent.delete(_key);
                error.captchaValue.delete(_key);
                error.reply.delete(_key);

                let formData = new FormData();
                formData.append('answerId',  answerId); 

                formData.append('friendReplyId',  replyId); 
                
                if(state.addReplyFriendContentField[replyId]){
                    formData.append('content', state.addReplyFriendContentField[replyId]); 
                }
                
                
                if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){
                    //验证码Key
                    formData.append('captchaKey', state.captchaKey.get(_key) as string);
                }
                
                //验证码值
                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                     formData.append('captchaValue', (state.captchaValue[_key] as string).trim());
                }

                proxy?.$axios({
                    url: '/user/control/answer/addAnswerReply',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){
                            ElMessage({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
                           

                            state.addReplyFriendContentField[replyId] = "";//清空

                            state.addReplyFriendFormView.set(replyId,false);


                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }

                            let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
                
                            queryAnswerList(state.questionId,'','',page);

                        }else{
                            //处理错误信息
                            for (const [key, value] of Object.entries(result.error) as [string, string][]){
                                if(key == 'content'){
                                    error.replyContent.set(_key,value);
                                }else if(key == 'friendReplyId'){
                                    error.reply.set(_key,value);
                                }else if(key == 'reply'){
                                    error.reply.set(_key,value);
                                }else if(key == 'captchaValue'){
                                    error.captchaValue.set(_key,value);
                                }
                            }

                            if(result.captchaKey != null){
                                state.showCaptcha.set(_key,true);
                                state.captchaKey.set(_key,result.captchaKey);
                                Object.assign(state.captchaValue, {[_key] : ''});
                                replaceCaptcha(_key);
                            }else{
                                state.showCaptcha.set(_key,false);
                            }

                            
                        }
                        state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                    }
                })
                .catch((error: any) =>{
                    console.log(error);
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                });
            }).catch(() => {
                console.log("提交数据错误");
            });

    }


    //添加回复表单
    const addReplyUI = (answerId:string) => {
        let _key =  "addReply-"+answerId;
        if(state.addReplyFormView.get(answerId) == true){//如果已打开
			return;
		}
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态


        proxy?.$axios({
            url: '/user/queryAddAnswerReply',
            method: 'get',
            params:  {
                answerId: answerId
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                if(data.allowReply){
                    state.addReplyFormView.set(answerId,true);

                    if (data.captchaKey != undefined && data.captchaKey != '') {
                        
                        state.showCaptcha.set(_key,true)
                        state.captchaKey.set(_key,data.captchaKey)
                        Object.assign(state.captchaValue, {[_key] : ''});
                        replaceCaptcha(_key);//刷新验证码
                    }

                    state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                }else{
                    ElMessage({
                        showClose: true,
                        message: '不允许添加回复',
                        type: 'info',
                    })
                }
            }
            
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //添加回复 -- 提交数据
    const onAddReply = (answerId:string) => {
        let _key =  "addReply-"+answerId;
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            error.captchaValue.set(_key,'');
            if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){

                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                    checkCaptchaValue(state.captchaValue[_key].trim(), (err:string)=>{
                        if(err != undefined){
                            error.captchaValue.set(_key,err);
                            state.allowSubmit.set(_key,false);//提交按钮disabled状态
                        }else{
                            resolve();
                        }
                    },_key) 
                }else{
                    error.captchaValue.set(_key,"验证码不能为空");
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                }
            }else{
                resolve();
            }
        });

        Promise.all([p1])
            .then(() => {
                //清空所有错误
                error.replyContent.delete(_key);
                error.captchaValue.delete(_key);
                error.reply.delete(_key);

                let formData = new FormData();
                formData.append('answerId', answerId);

                if(state.answerList != null && state.answerList.length > 0){
                    for (let i = 0; i <state.answerList.length; i++) {
                        let answer = state.answerList[i];
                        if(answer.id == answerId && state.addReplyContentField[i]){
                            formData.append('content',  state.addReplyContentField[i]);
                            break; 
                        }
                    }
                }
                
                if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){
                    //验证码Key
                    formData.append('captchaKey', state.captchaKey.get(_key) as string);
                }
                
                //验证码值
                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                     formData.append('captchaValue', (state.captchaValue[_key] as string).trim());
                }

                proxy?.$axios({
                    url: '/user/control/answer/addAnswerReply',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){
                            ElMessage({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
                           

                            
                            if(state.answerList != null && state.answerList.length > 0){
                                for (let i = 0; i <state.answerList.length; i++) {
                                    let answer = state.answerList[i];
                                    if(answer.id == answerId){
                                        state.addReplyContentField[i] = "";//清空
                                        break; 
                                    }
                                    
                                }
                            }
                            state.addReplyFormView.set(answerId,false);

                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }

                            let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
                
                            queryAnswerList(state.questionId,'','',page);

                        }else{
                            //处理错误信息
                            for (const [key, value] of Object.entries(result.error) as [string, string][]){
                                if(key == 'content'){
                                    error.replyContent.set(_key,value);
                                }else if(key == 'reply'){
                                    error.reply.set(_key,value);
                                }else if(key == 'captchaValue'){
                                    error.captchaValue.set(_key,value);
                                }
                            }

                            if(result.captchaKey != null){
                                state.showCaptcha.set(_key,true);
                                state.captchaKey.set(_key,result.captchaKey);
                                Object.assign(state.captchaValue, {[_key] : ''});
                                replaceCaptcha(_key);
                            }else{
                                state.showCaptcha.set(_key,false);
                            }

                            
                        }
                        state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                    }
                })
                .catch((error: any) =>{
                    console.log(error);
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                });
            }).catch(() => {
                console.log("提交数据错误");
            });
    }

    //取消回复
    const onCancelAddReply = (answerId:string) => {
        state.addReplyFormView.set(answerId,false);
    }
    //修改回复表单
    const editReplyUI = (reply:AnswerReply) => {
        let _key =  "editReply-"+reply.id;
        if(state.editReplyFormView.get(reply.id) == true){//如果已打开
			return;
		}
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态
    
        proxy?.$axios({
            url: '/user/queryEditAnswerReply',
            method: 'get',
            params:  {
                replyId: reply.id
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                let _reply = data.reply;
                if(data.allowReply && _reply != undefined){
                    state.editReplyFormView.set(reply.id,true);

                    if (data.captchaKey != undefined && data.captchaKey != '') {
                        
                        state.showCaptcha.set(_key,true)
                        state.captchaKey.set(_key,data.captchaKey)
                        Object.assign(state.captchaValue, {[_key] : ''});
                        replaceCaptcha(_key);//刷新验证码
                    }

                    state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                }else{
                    if(!data.allowReply){
                        ElMessage({
                            showClose: true,
                            message: '不允许修改回复',
                            type: 'info',
                        })
                    }
                }
            }
            
        })
        .catch((error: any) =>{
            console.log(error);
        });

    }

    //修改回复 -- 提交数据
    const onEditReply = (replyId:string) => {
        let _key =  "editReply-"+replyId;
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        const p1 = new Promise<void>((resolve, reject) => {
            error.captchaValue.set(_key,'');
            if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){

                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                    checkCaptchaValue(state.captchaValue[_key].trim(), (err:string)=>{
                        if(err != undefined){
                            error.captchaValue.set(_key,err);
                            state.allowSubmit.set(_key,false);//提交按钮disabled状态
                        }else{
                            resolve();
                        }
                    },_key) 
                }else{
                    error.captchaValue.set(_key,"验证码不能为空");
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                }
            }else{
                resolve();
            }
        });

        Promise.all([p1])
            .then(() => {
                //清空所有错误
                error.replyContent.delete(_key);
                error.captchaValue.delete(_key);
                error.reply.delete(_key);

                let formData = new FormData();
                formData.append('replyId', replyId);

                if(state.answerList != null && state.answerList.length > 0){
                    for (let i = 0; i <state.answerList.length; i++) {
                        let answer = state.answerList[i];
                        
                        if(answer.answerReplyList != null && answer.answerReplyList.length >0){
                            for (let j = 0; j <answer.answerReplyList.length; j++) {
                                let reply = answer.answerReplyList[j];
                                if(reply.id == replyId && state.editReplyContentField [i][j]){
                                    formData.append('content', state.editReplyContentField [i][j]); 
                                }
                            }
                        }
                        
                    }
                }
                
                if(state.captchaKey.get(_key) != undefined && state.captchaKey.get(_key) != null){
                    //验证码Key
                    formData.append('captchaKey', state.captchaKey.get(_key) as string);
                }
                
                //验证码值
                if(state.captchaValue[_key] != undefined && state.captchaValue[_key] != null && state.captchaValue[_key] != ''){
                     formData.append('captchaValue', (state.captchaValue[_key] as string).trim());
                }

                proxy?.$axios({
                    url: '/user/control/answer/editReply',
                    method: 'post',
                    data: formData
                })
                .then((response: AxiosResponse) => {
                    if(response){

                        const result: any = response.data;
                    
                        if(JSON.parse(result.success)){
                            
                            ElMessage({
                                showClose: true,
                                message: '提交成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
                           
                            state.editReplyFormView.set(replyId,false);

                            //重置表单
                            //formAddCommentRef.value?.resetFields();
                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }

                            let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
                
                            queryAnswerList(state.questionId,'','',page);

                        }else{
                            //处理错误信息
                            for (const [key, value] of Object.entries(result.error) as [string, string][]){
                                if(key == 'content'){
                                    error.replyContent.set(_key,value);
                                }else if(key == 'reply'){
                                    error.reply.set(_key,value);
                                }else if(key == 'captchaValue'){
                                    error.captchaValue.set(_key,value);
                                }
                            }

                            if(result.captchaKey != null){
                                state.showCaptcha.set(_key,true);
                                state.captchaKey.set(_key,result.captchaKey);
                                Object.assign(state.captchaValue, {[_key] : ''});
                                replaceCaptcha(_key);
                            }else{
                                state.showCaptcha.set(_key,false);
                            }

                            
                        }
                        state.allowSubmit.set(_key,false);;//提交按钮disabled状态
                    }
                })
                .catch((error: any) =>{
                    console.log(error);
                    state.allowSubmit.set(_key,false);//提交按钮disabled状态
                });
            }).catch(() => {
                console.log("提交数据错误");
            });
    }
    //取消修改回复
    const onCancelEditReply = (replyId:string) => {
        state.editReplyFormView.set(replyId,false);
    }

    //删除回复
    const onDeleteReply = (replyId:string) => {
        ElMessageBox.confirm('确定删除回复?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {
            let _key =  "addReply-"+replyId;
            let _key2 =  "editReply-"+replyId;

            //清空所有错误
            error.replyContent.delete(_key);
            error.captchaValue.delete(_key);
            error.reply.delete(_key);

            error.replyContent.delete(_key2);
            error.captchaValue.delete(_key2);
            error.reply.delete(_key2);
            let formData = new FormData();
            formData.append('replyId', replyId);

        

            proxy?.$axios({
                url: '/user/control/answer/deleteReply',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(JSON.parse(result.success)){
                        ElMessage({
                            showClose: true,
                            message: '删除成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })

                        state.addReplyFormView.set(replyId,false);
                        state.editReplyFormView.set(replyId,false);
                        state.addReplyFriendFormView.set(replyId,false);

                        

                        //重置表单
                        //formAddCommentRef.value?.resetFields();
                        if(state.showCaptcha.get(_key) == true){
                            Object.assign(state.captchaValue, {[_key] : ''});
                        }

                        let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
            
                        queryAnswerList(state.questionId,'','',page);

                    }else{
                        //处理错误信息
                        processErrorInfo(result.error as Map<string,string> , reactive({}),()=>{});


                        
                    }
                }
            })
            .catch((error: any) =>{
                console.log(error);
            });

        })
        .catch(() => {
            //取消
        })
    }

    //跳转私信
    const toPrivateMessage = (userName:string) => {
        router.push({path: '/user/control/privateMessageChatList',query:{friendUserName:userName}});
    }
    //查询是否已经关注该用户
    const queryFollowing = (userName:string) => {
        //清空信息
        state.followText = '关注';

        proxy?.$axios({
            url: '/queryFollowing',
            method: 'get',
            params:  {
                userName:userName
            },
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(JSON.parse(result)){
                    state.followText = '已关注';
                }
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }
    //添加关注
    const addFollow = (userName:string) => {
        if(state.followText =='关注'){
            let formData = new FormData();
            formData.append('userName', userName);
            
            proxy?.$axios({
                url: '/user/control/follow/add',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(JSON.parse(result.success)){
                        state.followText ='已关注'
                    }else{
                        //处理错误信息
                        processErrorInfo(result.error as Map<string,string> , error,()=>{});

                        

                    }
                }
            })
            .catch((error: any) =>{
                console.log(error);
            });
    
        }
        
    }
    //查询粉丝总数
    const queryFollowerCount = (userName:string) => {
        //清空信息
        state.followerCount = '0';


        proxy?.$axios({
            url: '/queryFollowerCount',
            method: 'get',
            params:  {
                userName:userName
            },
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                state.followerCount = result;
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }
    
    //查询回答总数
    const queryAnswerCount = (userName:string) => {
        //清空信息
        state.answerCount = '0';


        proxy?.$axios({
            url: '/queryAnswerCount',
            method: 'get',
            params:  {
                userName:userName
            },
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                state.answerCount = result;
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }

    //查询关注总数
    const queryFollowCount = (userName:string) => {
        //清空信息
        state.followCount = '0';


        proxy?.$axios({
            url: '/queryFollowCount',
            method: 'get',
            params:  {
                userName:userName
            },
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                state.followCount = result;
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }

    //查询相似问题
    const queryLikeQuestion = (questionId:string) => {
        proxy?.$axios({
            url: '/queryLikeQuestion',
            method: 'get',
            params:  {
                questionId:questionId
            },
        })
        .then((response: AxiosResponse) => {
            return response?.data;
        })
        .then((data: Array<Question>) => {
            state.likeQuestionList.length =0;

            if(data){
                state.likeQuestionList = data;
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }

    //点击回复层级
    const clickReplyLevel = (answerId:string,replyId:string) => {
       
       //是否点击已选中的项
       let isSelectedItem = false;


       if(state.dot.size >0){
           let lastFriendReplyId = [...state.dot][state.dot.size-1];//最后一个元素
           if(lastFriendReplyId[0] == replyId){
               isSelectedItem = true;
           }
       }

       state.dot.clear();
       state.line.clear();
       if(!isSelectedItem){
           showReplyLevel(answerId,replyId);
       }
       
   }

    //展示回复层级
    const showReplyLevel = (answerId:string,replyId:string) => {

        let dotArray = new Array();
        let replyList = [] as Array<AnswerReply>;
        if(state.answerList != null && state.answerList.length > 0){
            A:for (let i = 0; i <state.answerList.length; i++) {
                let answer = state.answerList[i];
                
                if(answer.id == answerId){
                    //回复
                    if(answer.answerReplyList != null && answer.answerReplyList.length >0){
                        replyList = answer.answerReplyList;
                        for (let j = 0; j <answer.answerReplyList.length; j++) {
                            let reply = answer.answerReplyList[j];
                            if(reply.id == replyId && reply.friendUserName != null && reply.friendUserName != ''){
                                let friendReplyIdArray = reply.friendReplyIdGroup.split(",");
                                for (let k = 0; k <friendReplyIdArray.length; k++) {
                                    let friendReplyId = friendReplyIdArray[k];
                                    if(friendReplyId != '' && friendReplyId != '0'){
                                        dotArray.push(friendReplyId);
                                    }
                                }
                                break A;
                            }
                        }
                    }
                }                       
                
            }
        }

        //第一个有效层级
        let firstLevel = '';

        A:for (let i = 0; i <dotArray.length; i++) {
            let friendReplyId = dotArray[i];
            for (let j = 0; j <replyList.length; j++) {
                let reply = replyList[j];
                if(reply.id == friendReplyId){
                    firstLevel = friendReplyId;
                    break A;
                }
            }
        }

        //过滤无效的点
        A:for (let i = dotArray.length - 1; i >= 0; i--) {
            let friendReplyId = dotArray[i];
            for (let j = 0; j <replyList.length; j++) {
                let reply = replyList[j];
                if(reply.id == friendReplyId){
                    continue A;
                }
            }
            dotArray.splice(i, 1);
        }

        if(dotArray.length >0){
            for (let i = 0; i <dotArray.length; i++) {
                let friendReplyId = dotArray[i];
                state.dot.set(friendReplyId,true);//楼中楼的点
            }
            for (let i = 0; i <replyList.length; i++) {
                let reply = replyList[i];
                if(reply.id == firstLevel){
                    state.line.set(reply.id,true);//楼中楼的线
                    continue;
                }
                if(reply.id == replyId){
                    break;
                }
                if(state.line.size >0){
                    state.line.set(reply.id,true);//楼中楼的线
                }
            }

            state.dot.set(replyId,true);//楼中楼点击的层
        }
    }

    //右边栏滚动事件
    const onRightScroll = (value: { scrollTop: number, fixed: boolean }) => {
        let clientHeight = document.documentElement.clientHeight;
        let rightOffsetHeight = right_ref.value.offsetHeight;
        if(rightOffsetHeight > clientHeight){
            state.affix_offset = -(rightOffsetHeight - clientHeight + 10);
        }
    }

    //清除编辑器
    const clearEditor = () => {
        if (Object.keys(state.appendQuestionEditor).length != 0) {//不等于空
            state.appendQuestionEditor.html("");//清空字段
			state.appendQuestionEditor.remove();
            state.appendQuestionEditor = {};
		}
        state.appendQuestionEditorCreateParameObject = {};
        state.appendQuestionMarkdownContent='';
        state.appendQuestionFormView = false;

        
        if (Object.keys(state.addAnswerEditor).length != 0) {//不等于空
            state.addAnswerEditor.html("");//清空字段
			state.addAnswerEditor.remove();
            state.addAnswerEditor = {};
		}
        state.addAnswerEditorCreateParameObject = {};
		
		
		
		state.editAnswerEditorMap.forEach(function(value,key){
            value.html("");//清空字段
			value.remove();
	    });
		state.editAnswerEditorMap.clear();

        state.addAnswerMarkdownContent='';


        state.isEditAnswerMarkdownMap.clear();
        state.editAnswerMarkdownContent = {} as any;//修改评论markdown编辑内容 key:评论Id value:评论内容

        state.appendQuestionEditorPlugin.length = 0;//插件
        state.addAnswerEditorPlugin.length = 0;//插件
        state.editAnswerEditorPlugin.length = 0;//插件

        state.editAnswerFormView.clear() //修改评论表单
        state.editAnswerEditorCreateParameMap.clear()//修改评论编辑器的创建参数

    }

    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'question'){
            let page:number | undefined = undefined;
            let questionId:string = '';
            let answerId:string = '';
            let replyId:string = '';
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            if(to.query.questionId != undefined){
                questionId = to.query.questionId as string
            }
            if(to.query.answerId != undefined){
                answerId = to.query.answerId as string
            }
            if(to.query.replyId != undefined){
                replyId = to.query.replyId as string
            }
            //清除编辑器
            clearEditor();
           
            queryQuestion(questionId,()=>{
                state.questionId = questionId;
                queryAddAnswer(questionId);
                queryFollowerCount(state.question.userName);//查询粉丝总数
                queryFollowing(state.question.userName);//查询是否已关注该用户
                queryAnswerCount(state.question.userName);
                queryFollowCount(state.question.userName);
            });
            queryAlreadyCollected(questionId);
            queryFavoriteCount(questionId);
            queryAnswerList(questionId,answerId,replyId,page);
            queryLikeQuestion(questionId);
        }
        
        next();
    });

    
    onMounted(() => {
        let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
        let questionId:string = router.currentRoute.value.query.questionId != undefined ?router.currentRoute.value.query.questionId as string :'';
        
        let answerId:string = router.currentRoute.value.query.answerId != undefined ?router.currentRoute.value.query.answerId as string :'';
        let replyId:string = router.currentRoute.value.query.replyId != undefined ?router.currentRoute.value.query.replyId as string :'';
        
        state.questionId = questionId;

        queryQuestion(questionId,()=>{
            queryAddAnswer(questionId);
            queryFollowerCount(state.question.userName);//查询粉丝总数
            queryFollowing(state.question.userName);//查询是否已关注该用户
            queryAnswerCount(state.question.userName);
            queryFollowCount(state.question.userName);
        });
        
        queryAlreadyCollected(questionId);
        queryFavoriteCount(questionId);
        queryAnswerList(questionId,answerId,replyId,page);
        queryLikeQuestion(questionId);
    }) 

    //卸载组件实例后调用
    onUnmounted (()=>{

    })
</script>
<style scoped lang="scss">
:deep(.dropdown-menu-icon){
    margin-right: 4px;
    position: relative;
    top: 3px;
}
.questionContentModule{
    display: flex;
    .left {
        flex: 1 0 auto;
        width: 900px;
        height: auto;
        .question-wrap{
            background: #fff;
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            position: relative;
            .questionTag{
                padding-top:15px;
                margin-left:15px;
                margin-right: 200px;
                .tag{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 14px;
                    padding: 6px 8px 6px 8px;
                    margin-right: 5px;
                    border-radius: 3px;
                    margin-bottom: 6px;
                    color: #20a0ff;
                    background-color: #E8F3FF;
                    position:relative;
                    &:hover {
                        background-color: #d8edff;
                        color: #1890ff;
                        text-decoration: none;
                    }
                }
            }
            .rightInfo{
                position:absolute; 
                right: 15px;
                top: 20px;
                font-size: 0px;
                .ipAddress{
                    float: right;
                    .icon{
                        margin-right: 3px;
	                    position: relative;
                        top: 2px;
                    }
                    span{
                        font-size: 15px;
                        color:$color-black-50;
                    }
                }
                .appendQuestion{
                    float: right;
                    .icon{
                        margin-right: 3px;
                        position: relative;
                        top: 3px;
                    }
                    span{
                        font-size: 15px;
                        margin-left: 10px;
                        color:$color-black-50;
                        cursor:pointer;
                    }
                }
                .report{
                    float: right;
                    .icon{
                        margin-right: 3px;
                        position: relative;
                        top: 3px;
                    }
                    span{
                        font-size: 15px;
                        margin-left: 10px;
                        color:$color-black-50;
                        cursor:pointer;
                    }
                }
            }
            .questionBox{
                height: auto;
                padding:15px 15px 15px 15px;
                .title{
                    color:$color-black-90;
                    font-weight:600;
                    font-size:22px;
                    border:none;
                    line-height:34px; 
                    margin:3px 0 18px 0;
                }
                .questionInfo{
                    color: $color-black-50; font-size: 14px;border-bottom:1px solid $color-black-20;padding-bottom: 5px;
                    .postTime{
                        float: left;
                    }
                    .viewTotal-icon{
                        float: left;margin-left: 20px;margin-top: 4px;
                        .icon{
                            position: relative;
                            top: -2px;
                        }
                
                    }
                    .viewTotal{
                        float: left;margin-left: 3px;
                    }
                    .answer-icon{
                        float: left;margin-left: 20px;margin-top: 4px;
                        .icon{
                            position: relative;
                            top: -2px;
                        }
                    }
                    .answer{
                        float: left;margin-left: 3px;
                    }
                }
                .reward{
                    margin-top: 10px;
                    background: #fcf3e6;
                    
                    height: 40px;
                    line-height: 40px;
                    border-radius:3px;
                    padding: 5px;
                    .info{
                        padding: 0px 12px;color: #e2b46d;font-size: 16px;
                        .icon{
                            font-size: 26px;position: relative;top: 6px;left: -4px;
                        }
                        .symbol{
                            font-family:Arial;font-weight:normal; vertical-align: middle; display:inline-block;margin-left: 5px;color: #cca558;
                        }
                        .amount{
                            margin-left: 1px;color: #cca558; margin-right: 5px;font-weight: 700;font-size: 18px;position: relative;top: 1px;
                        }
                        .point{
                            color: #cca558; margin-right: 5px;font-weight: 700;font-size: 18px;position: relative;top: 1px;
                        }
                    }
                }
                //举报标记
                .reportMark{
                    &:before{
                        content: " ";
                        position: absolute;
                        top: 0px;
                        left: -8px;
                        bottom:0px;
                        border-left: 5px solid #f89898;
                    }
                }

                :deep(.questionMarkdownContent){
                    margin-top:5px;
                    padding:20px 0px;
                    color:$color-black-90;
                    font-size:16px; 
                    line-height:1.75;
                    word-wrap:break-word;
                    min-height: 100px;
                    .cancelAccount{
                        display: inline-block;
                        vertical-align: middle;
                        padding: 6px 6px;
                        font-size: 14px;
                        line-height: 14px;
                        -webkit-border-radius: 2px;
                        -moz-border-radius: 2px;
                        border-radius: 2px;
                        color: $color-black-50;
                        background-color: $color-black-10;
                        margin-bottom: 6px;
                    }
                    .lastUpdateTime{
                        text-align: center;padding-top: 20px; padding-bottom: 30px;color: $color-black-60;font-size: 15px;
                    }
                    a{
                        color: #1890ff;
                    }
                    //自动换行
                    pre{
                        white-space:pre-wrap;
                    }
                    
                    ol{
                        list-style: decimal;
                    }
                    ol li{
                        list-style-type:decimal;
                        list-style-position:inside;
                    }
                    ul{
                        list-style: disc;
                    }
                    .task-list-item {
                        list-style-type:none;
                    }
                   // ul li{
                     //   list-style-type:disc;
                  //  }
                    p{
                        font-size:16px;
                        word-wrap:break-word
                    }
                    code[class*="language-"]{
                        padding: 0 0;
                    }
                    img{
                        max-width:100%;height:auto;border:none;background:none;margin:0;padding:0; 
                        cursor: -webkit-zoom-in;
                        cursor: zoom-in;
                        vertical-align: sub;
                    }

                    table {
                        border-collapse: separate; 
                        border-spacing: 0; 
                        border-top: 1px solid $color-black-30;
                        border-left: 1px solid $color-black-30;
                        th {
                            font-weight: 600
                        }
                        th, td {
                            border-right: 1px solid $color-black-30; 
                            border-bottom: 1px solid $color-black-30;
                            padding: 6px 13px
                        }
                        tr {
                            background-color: #fff;
                            border-top: 1px solid $color-black-30;
                            &:nth-child(2n) {
                                background-color: $color-black-10;
                            }
                        }
                    }
                    iframe{
                        width:100%; height: 550px;padding:10px 0px; 
                    }
                }
                :deep(.content){
                    margin-top:5px;padding:20px 0px;color:$color-black-90;font-size:16px; line-height:1.75; word-wrap:break-word;min-height: 100px;
                    .cancelAccount{
                        display: inline-block;
                        vertical-align: middle;
                        padding: 6px 6px;
                        font-size: 14px;
                        line-height: 14px;
                        -webkit-border-radius: 2px;
                        -moz-border-radius: 2px;
                        border-radius: 2px;
                        color: $color-black-50;
                        background-color: $color-black-10;
                    }
                    a{
                        color: #1890ff;
                    }
                    p{
                        font-size:16px;word-wrap:break-word
                    }
                    img{
                        max-width:100%;height:auto;border:none;background:none;margin:0;padding:0;
                        cursor: -webkit-zoom-in;
                        cursor: zoom-in;
                        vertical-align: sub;
                    }
                    
                    /** 解决Chrome内核浏览器DPI缩放比例高于100%时部分边框变粗问题   本方案需删除table样式 border="1" bordercolor="#000000" */
                    table {
                        border-collapse: separate; 
                        border-spacing: 0; 
                        border-top: 1px solid $color-black-30;
                        border-left: 1px solid $color-black-30;
                        th {
                            font-weight: 600
                        }
                        th, td {
                            border-right: 1px solid $color-black-30;
                            border-bottom: 1px solid $color-black-30;
                            padding: 6px 13px
                        }
                        tr {
                            background-color: #fff;
                            border-top: 1px solid $color-black-30;
                            &:nth-child(2n) {
                                background-color: $color-black-10;
                            }
                        }
                        /**
                        table {
                            width: 100%;
                            th {
                                font-weight: 600
                            }
                            td,th {
                                border: 1px solid $color-black-30;
                                padding: 6px 13px
                            }
                            tr {
                                background-color: #fff;
                                border-top: 1px solid $color-black-30;
                                &:nth-child(2n) {
                                    background-color: $color-black-10;
                                }
                            }
                        }**/
                    }
                    ol{
                        li{ 
                            list-style-type:decimal;
                            list-style-position:inside;
                        }
                    }
                    ul{
                        li{ 
                            margin-left:20px;
                            list-style-type:disc;
                        }
                    }
                    pre{
                        white-space:pre-wrap;
                    }
                }
                    
                :deep(.appendBox){
                    margin-top:25px;
                    position:relative;
                    .head {
                        height: 24px;
                        .prompt{
                            font-size: 15px;
                            line-height: 34px;
                        }
                        .appendTime{
                            margin-left:5px;
                            font-size: 15px;
                            line-height: 34px;
                        }
                    }
                    .appendMarkdownContent{
                        padding:20px 0px;
                        color:$color-black-90;
                        font-size:16px; 
                        line-height:1.75; 
                        word-wrap:break-word;
                        min-height: 80px;

                        a{
                            color: #1890ff;
                        }
                        //自动换行
                        pre{
                            white-space:pre-wrap;
                        }
                        
                        ol{
                            list-style: decimal;
                        }
                        ol li{
                            list-style-type:decimal;
                            list-style-position:inside;
                        }
                        ul{
                            list-style: disc;
                        }
                        .task-list-item {
                            list-style-type:none;
                        }
                    // ul li{
                        //   list-style-type:disc;
                    //  }
                        p{
                            font-size:16px;
                            word-wrap:break-word
                        }
                        code[class*="language-"]{
                            padding: 0 0;
                        }
                        img{
                            max-width:100%;height:auto;border:none;background:none;margin:0;padding:0; 
                            cursor: -webkit-zoom-in;
                            cursor: zoom-in;
                            vertical-align: sub;
                        }

                        table {
                            border-collapse: separate; 
                            border-spacing: 0; 
                            border-top: 1px solid $color-black-30;
                            border-left: 1px solid $color-black-30;
                            th {
                                font-weight: 600
                            }
                            th, td {
                                border-right: 1px solid $color-black-30; 
                                border-bottom: 1px solid $color-black-30;
                                padding: 6px 13px
                            }
                            tr {
                                background-color: #fff;
                                border-top: 1px solid $color-black-30;
                                &:nth-child(2n) {
                                    background-color: $color-black-10;
                                }
                            }
                        }
                        iframe{
                            width:100%; height: 550px;padding:10px 0px; 
                        }
                        
                    }
                    .appendContent{
                        padding:20px 0px;color:$color-black-90;font-size:16px; line-height:1.75; word-wrap:break-word;min-height: 80px;
                        a{
                            color: #1890ff;
                        }
                        p{
                            font-size:16px;word-wrap:break-word
                        }
                        img{
                            max-width:100%;height:auto;border:none;background:none;margin:0;padding:0;
                            cursor: -webkit-zoom-in;
                            cursor: zoom-in;
                            vertical-align: sub;
                        }
                        /** 解决Chrome内核浏览器DPI缩放比例高于100%时部分边框变粗问题   本方案需删除table样式 border="1" bordercolor="#000000" */
                        table {
                            border-collapse: separate; 
                            border-spacing: 0; 
                            border-top: 1px solid $color-black-30;
                            border-left: 1px solid $color-black-30;
                            th {
                                font-weight: 600
                            }
                            th, td {
                                border-right: 1px solid $color-black-30;
                                border-bottom: 1px solid $color-black-30;
                                padding: 6px 13px
                            }
                            tr {
                                background-color: #fff;
                                border-top: 1px solid $color-black-30;
                                &:nth-child(2n) {
                                    background-color: $color-black-10;
                                }
                            }
                            /**
                            table {
                                width: 100%;
                                th {
                                    font-weight: 600
                                }
                                td,th {
                                    border: 1px solid $color-black-30;
                                    padding: 6px 13px
                                }
                                tr {
                                    background-color: #fff;
                                    border-top: 1px solid $color-black-30;
                                    &:nth-child(2n) {
                                        background-color: $color-black-10;
                                    }
                                }
                            }**/
                        }
                        ol{
                            li{ 
                                list-style-type:decimal;
                                list-style-position:inside;
                            }
                        }
                        ul{
                            li{ 
                                margin-left:20px;
                                list-style-type:disc;
                            }
                        }
                        pre{
                            white-space:pre-wrap;
                        }
                    }
                }
                .odd{
                    .head{
                        color: #f9ce00;
                    }
                    &:before{
                        content: " ";
                        position: absolute;
                        top: 0px;
                        left: -15px;
                        bottom:0px;
                        border-left: 5px solid #f9ce00;
                    }
                }
                .even{
                    .head{
                        color: #85eb4e;
                    }
                    &:before{
                        content: " ";
                        position: absolute;
                        top: 0px;
                        left: -15px;
                        bottom:0px;
                        border-left: 5px solid #85eb4e;
                    }
                }
            }
        }
    }
    .right{
        order: 2;
        flex: 0 0 auto;
        width: 300px;
        height: auto;
        margin-left: 10px;
        .affix-container{
            height: 100%;
        }
        .right-container{
            .userInfo-wrap{
                background: #fff;
                box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
                .userInfo {
                    padding: 20px 0 20px 0;
                    margin-left:8px;
                    margin-right:8px;
                    height: auto;
                    overflow: hidden;
                    position: relative;
                    .author{
                        text-align: center;
                        img{
                            width: 70px;
                            height: 70px;
                            border-radius: 50%;
                        
                        }
                    }
                    .name{
                        font-size: 18px;
                        font-weight: 600;
                        text-align: center;
                        margin:14px 0 4px 0;
                        a{
                            color: $color-black-70;
                        }
                    }
                    .role{
                        text-align: center;
                        .userRoleName{
                            display: inline-block;
                            white-space:nowrap;
                            vertical-align: middle;
                            padding: 2px 4px;
                            margin-right:5px;
                            font-size: 13px;
                            line-height: 16px;
                            -webkit-border-radius: 2px;
                            -moz-border-radius: 2px;
                            border-radius: 2px;
                            color:#e2b46e;
                            background-color:#f8e7c4;
                        }
                        .staff{
                            display: inline-block;
                            white-space:nowrap;
                            vertical-align: middle;
                            padding: 2px 4px;
                            font-size: 13px;
                            line-height: 16px;
                            -webkit-border-radius: 2px;
                            -moz-border-radius: 2px;
                            border-radius: 2px;
                            color:#4CD263;
                            background-color:#cafcc7;
                        }
                    }
                    ul{
                        width: 100%;
                        height: auto;
                        overflow: hidden;
                        padding: 15px 0 18px 0;
                        border-top: 1px solid $color-black-20;
                        margin-top: 20px;
                        li{
                            float: left;
                            width: 33%;
                            span{
                                display: block;
                                text-align: center;
                                a{
                                    color: #333;
                                    margin-bottom: 0px;
                                }
                                &:nth-child(1){
                                    font-size: 16px;
                                    font-weight: 600;
                                    color: $color-black-80;
                                }
                                &:nth-child(2){
                                    font-size: 12px;
                                    color: $color-black-60;
                                    a{
                                        color: $color-black-60;
                                    }
                                }
                            }
                        }
                    }
                    .action-button {
                        text-align: center;
                        .action-followBox{
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    }
}
/** 收藏夹表单模块 **/
.favorite-formModule {
    margin-top: 40px;
    text-align: center;
    margin-bottom: 10px;
    .numberButton{
        margin-right: 10px;
        .button{
            position: relative;
            color: #fff;
            background: #20a0ff;
            border:1px solid #20a0ff;
            outline: none;
            display: inline-block;
            padding-left: 25px;
            padding-right:25px; 
            font-size: 16px;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            border-radius: 3px 0px 0px 3px;
            margin: 0;
            text-decoration: none;
            &:hover{background:#58b7ff;border:1px solid #58b7ff;}
        }
        .number{
            position: relative;
            color: #45b6f7;
            background: none;
            border-top:1px solid #20a0ff;
            border-bottom:1px solid #20a0ff;
            border-right:1px solid #20a0ff;
            outline: none;
            display: inline-block;
            padding-bottom:0px;
            padding-left: 12px;
            padding-right:12px; 
            font-size: 16px;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            border-radius: 0px 3px 3px 0px;
            text-decoration: none;
        }
    }
}

//追加问题
.appendQuestion-formModule{
    margin-top:30px;
    margin-bottom: 50px;
    :deep(.bytemd){
        height: calc(100vh - 100px);
        
    }
    :deep(.CodeMirror-scroll){//让外层滚动条不滚动
        overscroll-behavior:  contain;
    }
    :deep(.bytemd-preview){//让外层滚动条不滚动
        overscroll-behavior:  contain;
    }
    //图标表单
    .iconForm-container{
        margin-top: 15px;
        :deep(.el-form-item__content) {
            line-height: normal;
        }
        :deep(.el-form-item__error) {
            width: 100%;
        }
        .captcha-item{
            .captchaInput{
                width: 130px;
            }
            :deep(.el-form-item__error){
                width: 100%;
            }
            .replaceCaptchaText{
                position: relative;
                top: 10px;
                user-select:none;
            }
        }
    }
}

/* 答案添加 */
.answer-formModule {
    margin-top:10px;
    .addAnswer-wrap{
        position: relative;
        background: #fff;
        padding:15px 15px 15px 15px;
        box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
        :deep(.bytemd-split){
                height: calc(100vh - 100px);
            }
            :deep(.bytemd-split .CodeMirror-scroll){//让外层滚动条不滚动
                overscroll-behavior:  contain;
            }
            :deep(.bytemd-split .bytemd-preview){//让外层滚动条不滚动
                overscroll-behavior:  contain;
            }
            :deep(.bytemd-editor){
                min-height: 180px; 
            }
            :deep(.CodeMirror-sizer){
                min-height: 175px !important; 
            }
            :deep(.bytemd-preview){
                min-height: 180px; 
            }
        
        .form-action{
            position: relative;

           
            .submitButton{
                width: 130px;
            }
            .promptInfo{
                position: absolute;
                top: 9px;
                right:15px;
                
                h2{
                    font-size: 15px;
                    color: $color-black-40;
                    font-weight: normal;
                }
            }
        }
        
        //图标表单
        .iconForm-container{
            margin-top: 15px;
            :deep(.el-form-item__content) {
                line-height: normal;
            }
            :deep(.el-form-item__error) {
                width: 100%;
            }
            .captcha-item{
                .captchaInput{
                    width: 130px;
                }
                :deep(.el-form-item__error){
                    width: 100%;
                }
                .replaceCaptchaText{
                    position: relative;
                    top: 10px;
                    user-select:none;
                }
            }
        }
    }
}

.addAnswerModule{
    margin-top:10px;
    .addAnswer-wrap{
        background: #fff;
        padding:15px 15px 15px 15px;
        box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
    }
    .respond {
        background: $color-black-10;border-radius:4px;line-height: 40px;text-align:center;
        p {
            font-size:15px;
            padding:8px;
            overflow:hidden;
            text-align:center;
            color: $color-black-50;
        }
        a{
            color: #1890ff;
        }
    }
}

/** 答案列表 **/
.answerModule{
    margin-top:10px;
    padding: 0px 10px 50px 10px;
    position: relative;
    padding-bottom:0;
    background: #fff;
    box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
    .answerList{
        list-style:none;
        font-size: 15px;
        .answer{
            padding:15px 0 5px 77px;
            border-bottom:1px solid $color-black-20;
            .adoption{
                display: none;
                position: absolute;
            }
        }
        .active{
            position:relative;
            &:before{
                content: " ";
                position: absolute;
                top: 0px;
                left: -10px;
                bottom:0px;
                border-left: 5px solid #fe9d2d;
            }
            .adoption{
                display: inline;
                position: absolute;
                right: 0px;
                top: 0px;
            }
        }
        .answer-author{
            position:relative;
            color:#999;
            img{
                width:60px;
                height:60px;
                position:absolute;
                left:-72px;
                -webkit-border-radius:50%;
                -moz-border-radius:50%;
                border-radius:50%;
                display:block;
            }
        }
        .adoption-post-box{
            position: absolute;
            top: 80px;
            left:-53px;
        }
        .adoption-post{
            color: $color-black-50;
            cursor: pointer;
            text-align: center;
            i{
                font-size: 20px
            }
            &:hover{
                i {
                    color: #23C343;/** #999 **/
                }
                span {
                    color: #23C343;/** #999 **/
                }
            }
            span{
                font-size: 13px
            }
        }
        .info-container{
            font-style:normal; 
            font-size:0;/*父级元素设置font-size:0; 解决 display：inline-block两个元素之间的默认空格 */
            .userName{
                display: inline-block;
                color: $color-black-60;
                font-size: 14px;
            }
        }
        .cancelNickname{
            font-size: 14px;
            font-weight:normal;
            margin-right: 3px;
            color: transparent;
            text-shadow: 0 0 5px rgba(0,0,0,0.4);
            zoom: 1;
            user-select:none;
        }
        .userRoleName{
            display: inline-block;
            white-space:nowrap;
            vertical-align: middle;
            padding: 2px 4px;
            margin-left:5px;
            font-size: 12px;
            line-height: 14px;
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            border-radius: 2px;
            color:#e2b46e;
            background-color:#f8e7c4;
            position: relative;
            top: -5px;
        }
        .staff{
            display: inline-block;
            white-space:nowrap;
            vertical-align: middle;
            padding: 2px 4px;
            margin-left:5px;
            font-size: 12px;
            line-height: 14px;
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            border-radius: 2px;
            color:#4CD263;
            background-color:#cafcc7;
            position: relative;
            top: -5px;
        }
        .master{
            display: inline-block;
            white-space:nowrap;
            vertical-align: middle;
            padding: 2px 4px;
            margin-left:5px;
            font-size: 12px;
            line-height: 14px;
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            border-radius: 2px;
            color:#fff;
            background-color:#4cc8ff;
            position: relative;
            top: -5px;
        }
        .answerTime{
            margin-top:3px; 
            margin-bottom:5px;
            color:$color-black-50;
            font-size: 13px;
            a{
                color:$color-black-50;
            }
        }
        .answer{
            :deep(.answerMarkdownContent){
                padding:0px;
                word-wrap:break-word;
                color:$color-black-90;
                font-size:15px; 
                line-height:1.75;
                margin-top: 20px;
                .cancelAccount{
                    display: inline-block;
                    vertical-align: middle;
                    padding: 6px 6px;
                    font-size: 14px;
                    line-height: 14px;
                    -webkit-border-radius: 2px;
                    -moz-border-radius: 2px;
                    border-radius: 2px;
                    color: $color-black-50;
                    background-color: $color-black-10;
                }
                img {
                    max-width:100%;
                    height:auto;
                    border:none;
                    background:none;
                    margin:0;
                    padding:0;
                    vertical-align: sub;
                }
                p{
                    font-size:16px;
                    word-wrap:break-word
                }
                code[class*="language-"]{
                    padding: 0 0;
                }
                /** 解决Chrome内核浏览器DPI缩放比例高于100%时部分边框变粗问题   本方案需删除table样式 border="1" bordercolor="#000000" */
                table {
                    border-collapse: separate; 
                    border-spacing: 0; 
                    border-top: 1px solid $color-black-30;
                    border-left: 1px solid $color-black-30;
                    th {
                        font-weight: 600
                    }
                    th, td {
                        border-right: 1px solid $color-black-30;
                        border-bottom: 1px solid $color-black-30;
                        padding: 6px 13px
                    }
                    tr {
                        background-color: #fff;
                        border-top: 1px solid $color-black-30;
                        &:nth-child(2n) {
                            background-color: $color-black-10;
                        }
                    }
                    /**
                    table {
                        width: 100%;
                        th {
                            font-weight: 600
                        }
                        td,th {
                            border: 1px solid $color-black-30;
                            padding: 6px 13px
                        }
                        tr {
                            background-color: #fff;
                            border-top: 1px solid $color-black-30;
                            &:nth-child(2n) {
                                background-color: $color-black-10;
                            }
                        }
                    }**/
                }
                ol{
                    li{ 
                        list-style-type:decimal;
                        list-style-position:inside;
                    }
                }
                ul{
                    li{ 
                        margin-left:20px;
                        list-style-type:disc;
                    }
                }
                .task-list-item {
                    list-style-type:none;
                }
                iframe{
                    width:100%; height: 550px;padding:10px 0px; 
                }
            }
             :deep(.answerContent){
                padding:0px;
                word-wrap:break-word;
                color:$color-black-90;
                font-size:15px; 
                line-height:1.75;
                margin-top: 20px;
                .cancelAccount{
                    display: inline-block;
                    vertical-align: middle;
                    padding: 6px 6px;
                    font-size: 14px;
                    line-height: 14px;
                    -webkit-border-radius: 2px;
                    -moz-border-radius: 2px;
                    border-radius: 2px;
                    color: $color-black-50;
                    background-color: $color-black-10;
                }
                img {
                    max-width:100%;
                    height:auto;
                    border:none;
                    background:none;
                    margin:0;
                    padding:0;
                    vertical-align: sub;
                }
                pre{
                    white-space:pre-wrap;
                    code{/*连续字母数字换行*/
                        word-break: break-all;
                    }
                }
                /** 解决Chrome内核浏览器DPI缩放比例高于100%时部分边框变粗问题   本方案需删除table样式 border="1" bordercolor="#000000" */
                table {
                    border-collapse: separate; 
                    border-spacing: 0; 
                    border-top: 1px solid $color-black-30;
                    border-left: 1px solid $color-black-30;
                    th {
                        font-weight: 600
                    }
                    th, td {
                        border-right: 1px solid $color-black-30;
                        border-bottom: 1px solid $color-black-30;
                        padding: 6px 13px
                    }
                    tr {
                        background-color: #fff;
                        border-top: 1px solid $color-black-30;
                        &:nth-child(2n) {
                            background-color: $color-black-10;
                        }
                    }
                    /**
                    table {
                        width: 100%;
                        th {
                            font-weight: 600
                        }
                        td,th {
                            border: 1px solid $color-black-30;
                            padding: 6px 13px
                        }
                        tr {
                            background-color: #fff;
                            border-top: 1px solid $color-black-30;
                            &:nth-child(2n) {
                                background-color: $color-black-10;
                            }
                        }
                    }**/
                }
                ol{
                    li{ 
                        list-style-type:decimal;
                        list-style-position:inside;
                    }
                }
                ul{
                    li{ 
                        margin-left:20px;
                        list-style-type:disc;
                    }
                }
            }
        }
        .tipBottom {
            font-size: 13px;
            margin: 25px 10px 5px 50px;
            text-align: right;
            .a-toolbar {
                display: block;
                width: 100%;
                a {
                    color: $color-black-50;
                    margin-left: 15px;
                    .icon{
                        font-size: 15px;
                        margin-right: 3px;
                        position: relative;
                        top: 3px;
                    }
                    &:hover {
                        color: #1890ff;
                    }
                }
                .ipAddress-text {
                    color: $color-black-50;
                    margin-left: 15px;
                    margin-right: 3px;
                    .icon{
                        margin-right: 3px;
                        position: relative;
                        top: 3px;
                    }
                }
                .report{
                    color: $color-black-50;
                    margin-left: 15px;
                    margin-right: 3px;
                    user-select:none;
                    cursor:pointer;
                    .icon{
                        margin-right: 3px;
                        position: relative;
                        top: 3px;
                    }
                    &:hover {
                        color: #1890ff;
                    }
                }
            }
        }
        //举报标记
        .reportMark{
            position:relative;
            &:before{
                content: " ";
                position: absolute;
                top: 0px;
                left: -18px;
                bottom:0px;
                border-left: 5px solid #f89898;
            }
        }
        .replyList {
            padding: 10px 0 0px;
            margin-left: 36px;
            margin-right:10px;
            position: relative;
            line-height: 22px;
            margin-top: 20px;
            background: $color-black-10;
            &:before {
                position: absolute;
                display: block;
                width: 16px;
                height: 16px;
                border-top: 1px solid $color-black-10;
                border-left: 1px solid $color-black-10;
                -webkit-transform: rotate(45deg);
                -moz-transform: rotate(45deg);
                -o-transform: rotate(45deg);
                transform: rotate(45deg);
                content: "";
                background-color: $color-black-10;
                top: -4px;
                left: 60px
            }
            .box{
                .replyItem-container{
                    position: relative;
                    left: -30px;

                    &:last-child{
                        //border-bottom: 1px solid #fff;
                        .replyItem{
                            border-bottom: 1px solid transparent;
                        }
                    }
                    &:before,
                    &:after {
                        content: "";
                        display: table;
                        font: 0/0 a
                    }
                    &:after {
                        clear: both;
                    }
                    .replyItem {
                        margin-bottom: 10px;
                        border-bottom: 1px solid #EDEEF1;
                        padding-bottom: 5px;
                        margin-left: 40px;
                        margin-right:-20px;
                        //举报标记
                        .reply-reportMark{
                            position: relative;
                            &:before{
                                content: " ";
                                position: absolute;
                                top: -10px;
                                left: -18px;
                                bottom:-5px;
                                border-left: 5px solid #f89898;
                            }
                        }
                        .reply-top{
                            .reply-author{
                                float: left;
                                position:relative;
                                font-size:0;/*父级元素设置font-size:0; 解决 display：inline-block两个元素之间的默认空格 */
                                .avatarBox{
                                    position:absolute;
                                    border-radius:100%;
                                    left: 0px;
                                    img{
                                        border-radius:100%;
                                        width: 40px;
                                        height: 40px;
                                        margin-top: -1px;
                                    }
                                }
                                .time{
                                    margin-left: 50px;
                                    color:$color-black-50;
                                    font-size: 13px;
                                    position: relative;
                                    top: -7px;
                                }
                                .cancelNickname{
                                    font-weight:normal;
                                    margin-right: 3px;
                                    color: transparent;
                                    text-shadow: 0 0 5px rgba(0,0,0,0.4);
                                    zoom: 1;
                                    user-select:none;
                                    font-size: 14px;
                                    display: inline-block;
                                    margin-left: 50px;
                                }
                                .userName {
                                    display: inline-block;color: $color-black-60; margin-left: 50px;
                                    font-size: 14px;
                                }
                                .userRoleName{
                                    display: inline-block;
                                    white-space:nowrap;
                                    vertical-align: middle;
                                    padding: 2px 4px;
                                    margin-left:5px;
                                    font-size: 12px;
                                    line-height: 14px;
                                    -webkit-border-radius: 2px;
                                    -moz-border-radius: 2px;
                                    border-radius: 2px;
                                    color:#e2b46e;
                                    background-color:#f8e7c4;
                                    position: relative;
                                    top: -5px;
                                }
                                .staff{
                                    display: inline-block;
                                    white-space:nowrap;
                                    vertical-align: middle;
                                    padding: 2px 4px;
                                    margin-left:5px;
                                    font-size: 12px;
                                    line-height: 14px;
                                    -webkit-border-radius: 2px;
                                    -moz-border-radius: 2px;
                                    border-radius: 2px;
                                    color:#4CD263;
                                    background-color:#cafcc7;
                                    position: relative;
                                    top: -5px;
                                }
                                .master{
                                    display: inline-block;
                                    white-space:nowrap;
                                    vertical-align: middle;
                                    padding: 2px 4px;
                                    margin-left:5px;
                                    font-size: 12px;
                                    line-height: 14px;
                                    -webkit-border-radius: 2px;
                                    -moz-border-radius: 2px;
                                    border-radius: 2px;
                                    color:#fff;
                                    background-color:#4cc8ff;
                                    position: relative;
                                    top: -5px;
                                }
                            }
                            .friendInfo{
                                float: left;
                                margin-left: 80px;
                                position:relative;
                                .arrow{
                                    float: left;
                                    color: $color-black-50;
                                    position: relative;
                                    top: 12px;
                                    left: -45px;
                                }
                                .friendAvatarBox{
                                position:absolute;
                                    border-radius:100%;
                                    left: 0px;
                                    img{
                                        border-radius:100%;
                                        width: 20px;
                                        height: 20px;
                                        margin-top: 10px;
                                    }
                                }
                                
                                .nameInfo {
                                    color:$color-black-60;
                                    font-size:14px;
                                    float: left;
                                    margin-left: 15px;
                                    font-weight: normal;
                                    .cancelNickname{
                                        font-weight:normal;
                                        margin-right: 3px;
                                        color: transparent;
                                        text-shadow: 0 0 5px rgba(0,0,0,0.4);
                                        zoom: 1;
                                        user-select:none;
                                        font-size: 14px;
                                        display: inline-block;
                                        position: relative;top: 9px;
                                    }
                                    .userName {
                                        display: inline-block;
                                        color: $color-black-60; 
                                        font-size: 14px;
                                        position: relative;
                                        top: 10px;
                                        max-width: 130px;
                                        overflow:hidden; //超出的文本隐藏
                                        text-overflow:ellipsis; //溢出用省略号显示
                                        white-space:nowrap; //溢出不换行
                                    }
                                    .master{
                                        display: inline-block;
                                        white-space:nowrap;
                                        vertical-align: middle;
                                        padding: 2px 4px;
                                        margin-left:5px;
                                        font-size: 12px;
                                        line-height: 14px;
                                        -webkit-border-radius: 2px;
                                        -moz-border-radius: 2px;
                                        border-radius: 2px;
                                        color:#fff;
                                        background-color:#4cc8ff;
                                        position: relative;
                                        top: 3px;
                                    }
                                }
                            }
                            .ipAddress {
                                float: right;
                                color:$color-black-50;
                                .ipAddress-icon{
                                    color: $color-black-50;
                                }
                                .ipAddress-text{
                                    position: relative;
                                    top: -2px;
                                    margin-left: 2px;
                                    color: $color-black-50;
                                    font-size: 13px;
                                }
                                .more{
                                    margin-left: 7px;
                                    .icon{
                                        position: relative;
                                        top: 3px;
                                        color: $color-black-50;
                                    }
                                }
                            }
                            
                        }
                        .replyContent{
                            font-size: 15px;
                            line-height:26px;
                            color:$color-black-80;
                            margin-top: 10px;
                            padding-top: 8px;
                            padding-bottom: 8px;
                            .cancelAccount{
                                display: inline-block;
                                vertical-align: middle;
                                padding: 6px 6px;
                                font-size: 14px;
                                line-height: 14px;
                                -webkit-border-radius: 2px;
                                -moz-border-radius: 2px;
                                border-radius: 2px;
                                color: $color-black-50;
                                background-color:  $color-black-25;
                            }
                        }
                    }
                }
            }
        }
    }
    .ribbon-wrapper {
        width: 106px;
        height: 108px;
        overflow: hidden;
        position: absolute;
        top: -6px;
        right: -16px; 
        .ribbon {
            font-size: 18px;
            font-weight: 600;
            line-height: 18px;
            text-align: center;
            text-transform: uppercase;
            transform: rotate(45deg);
            position: relative;
            padding: 7px 0;
            left: -11px;
            top: 26px;
            width: 150px;
            background-color: #fe9d2d;
            color: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            letter-spacing: 0.5px; 
            &:before, &:after {
                content: "";
                border-top: 4px solid #ce8025;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                position: absolute;
                bottom: -4px; 
            }
            &:before {
                left: 0; 
            }
            &:after {
                right: 0; 
            }
        }
    }
    .page{
        padding-top: 30px;
        padding-bottom: 33px;
        display: flex;
        justify-content: flex-end;
        background: #fff;
    }
}

/* 答案修改 */
.editAnswer-formModule {
    margin-top:50px;
    .editAnswer-wrap{
        position: relative;
        padding:8px 20px 1px 20px;
        background: $color-black-10;
        .head{
            .icon{
                position: absolute;font-size: 50px;top: -38px;left: -42px;color: $color-black-10;
            }
        }
        :deep(.bytemd-split){
            height: calc(100vh - 100px);
        }
        :deep(.bytemd-split .CodeMirror-scroll){//让外层滚动条不滚动
            overscroll-behavior:  contain;
        }
        :deep(.bytemd-split .bytemd-preview){//让外层滚动条不滚动
            overscroll-behavior:  contain;
        }
        :deep(.bytemd-editor){
            min-height: 180px; 
        }
        :deep(.CodeMirror-sizer){
            min-height: 175px !important; 
        }
        :deep(.bytemd-preview){
            min-height: 180px; 
        }
        /** 隐藏‘斜体图标’ **/
        :deep(.bytemd-toolbar-left [bytemd-tippy-path='2']) {
            display: none;
        }
        /** 隐藏‘删除线图标’ **/
        :deep(.bytemd-toolbar-left [bytemd-tippy-path='11']) {
            display: none;
        }
        //编辑器边框
        :deep(.bytemd-editor){
            border-top: 1px solid $color-black-30;
            border-left: 1px solid transparent;
            border-right: 1px solid transparent;
            
            border-radius:0px;
        }
        :deep(.bytemd-status){
            border: 1px solid transparent;
            border-top: 1px solid $color-black-30;
            border-radius:0px;
        }
        :deep(.bytemd-preview){
            border-top: 1px solid $color-black-30;
            border-left: 1px solid transparent;
            border-right: 1px solid transparent;
            border-radius:0px;
        }
        :deep(.bytemd-split .bytemd-editor){
            border-right: 1px solid $color-black-30;
        }
        :deep(.bytemd-sidebar){
            border-top-left-radius:0px;
            border-left: 1px solid $color-black-30;
        }
        :deep(.bytemd-editor:has(~ .bytemd-sidebar)){
            border-right: 1px solid $color-black-30;
        }
        :deep(.bytemd-editor:has(+ .bytemd-preview:not([style*='display:none']))){
            border-right: 1px solid $color-black-30;
        }
        :deep(.bytemd-editor:has(~ .bytemd-hidden)){
            border-right: 1px solid transparent;
        }
        :deep(.bytemd-preview:has(+ .bytemd-sidebar)){
            border-right: 1px solid $color-black-30;
        }
        :deep(.bytemd-preview:has(~ .bytemd-hidden)){
            border-right: 1px solid transparent;
        }

        /* 富文本编辑框颜色 */
        :deep(.ke-edit) {
            border: 1px solid transparent;
        }
        
        .submitButton{
            width: 130px;
        }
    }
    //图标表单
    .iconForm-container{
        margin-top: 15px;
        :deep(.el-form-item__content) {
            line-height: normal;
        }
        :deep(.el-form-item__error) {
            width: 100%;
        }
        .captcha-item{
            .captchaInput{
                width: 130px;
                
            }
            :deep(.el-input__wrapper){
                background: #fff;
            }
            :deep(.el-form-item__error){
                width: 100%;
            }
            :deep(.el-image){
                height: 100%;
            }
            .replaceCaptchaText{
                position: relative;
                top: 10px;
                user-select:none;
            }
        }
    }
}

/* 添加举报 */
.addReport-formModule {
	.addReport-wrap{
        position: relative;
        padding:0px 10px 10px 10px;
        .reportType-container{
            display: flex;
            flex-direction: column;
            .reportType-group{
                display: flex;
                flex-direction: column;
                margin-bottom: 15px;
                .reportType-name{
                    margin-bottom: 15px;
                    font-size: 14px;
                    text-align: left;
                    color: $color-black-60;
                }
                .reportType-list{
                    display: flex;
                    flex-wrap: wrap;
                    padding: 0;
                    margin: 0;
                    list-style: none;
                    white-space: nowrap;
                    .reportType-item{
                        display: flex;
                        flex-wrap: wrap;
                        padding: 0;
                        margin: 0;
                        margin-right:30px;
                        list-style: none;
                        white-space: nowrap;
                    }
                }
            }
        }
        :deep(.el-upload--picture-card) {
            background-color: $color-black-10;
            border: 1px dashed $color-black-10;
        }
        .submitButton{
            width: 130px;
        }
    }
    .captcha-item{
        .captchaInput{
            width: 130px;
            
        }
       
        :deep(.el-form-item__error){
            width: 100%;
        }
        :deep(.el-image){
            height: 100%;
        }
        .replaceCaptchaText{
            position: relative;
            top: 10px;
            user-select:none;
        }
    }
}

/* 添加回复 */
.answerReply-formModule {
	margin-top:10px;
	.addReply-wrap{
        position: relative;
        padding:20px 10px 30px 10px;
        .submitButton{
            width: 130px;
        }
    }
    .captcha-item{
        .captchaInput{
            width: 130px;
            
        }
        :deep(.el-input__wrapper){
            background: #fff;
        }
        :deep(.el-form-item__error){
            width: 100%;
        }
        :deep(.el-image){
            height: 100%;
        }
        .replaceCaptchaText{
            position: relative;
            top: 10px;
            user-select:none;
        }
    }
}
/* 添加回复对方 */
.addAnswerReplyFriend-formModule {
	margin-top:30px;
	margin-left: 10px;
	margin-right:10px;
	margin-bottom:10px;
    .addReplyFriend-wrap{
        position: relative;
        .submitButton{
            width: 130px;
        }
        :deep(.el-textarea__inner){
            background-color: #fff;
        }

    }
    .captcha-item{
        .captchaInput{
            width: 130px;
            
        }
        :deep(.el-input__wrapper){
            background: #fff;
        }
        :deep(.el-form-item__error){
            width: 100%;
        }
        :deep(.el-image){
            height: 100%;
        }
        .replaceCaptchaText{
            position: relative;
            top: 10px;
            user-select:none;
        }
    }
}
/* 修改回复 */
.editAnswerReply-formModule {
	margin-top:30px;
	margin-left: 10px;
	margin-right:10px;
	margin-bottom:10px;
    .editReply-wrap{
        position: relative;
        .submitButton{
            width: 130px;
        }
        :deep(.el-textarea__inner){
            background-color: #fff;
        }

    }
    .captcha-item{
        .captchaInput{
            width: 130px;
            
        }
        :deep(.el-input__wrapper){
            background: #fff;
        }
        :deep(.el-form-item__error){
            width: 100%;
        }
        :deep(.el-image){
            height: 100%;
        }
        .replaceCaptchaText{
            position: relative;
            top: 10px;
            user-select:none;
        }
    }
}

/** 相似问题 **/
.likeQuestionModule{
	margin-top: 10px;
	background: #fff;
	box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
    .likeQuestion{
        margin-bottom:10px;padding:0 15px 0;
        .title{
            font-size:18px;
            padding:20px 0 15px;
            color:$color-black-90;
            border-bottom:1px solid $color-black-20;
            font-weight: 600;
        }
        .questionList {
            font-size: 15px;
            margin-top: 10px;
            > .question-title {
                counter-increment: index;
                display: flex;
                flex-direction: row;
                padding-top: 5px;
                padding-bottom: 5px;
                &::before {
                    content: counter(index);
                    display: flex;
                    width: 22px;
                    height: 22px;
                    background-color: #E8F3FF;
                    text-align: center;
                    border-radius: 4px;
                    flex: none;
                    align-items: center;
                    justify-content: center;
                    color: #20a0ff;
                }
                .top{
                    &::before {
                        background-color: #1890ff;
                        color: #fff;
                    }
                }
                > a {
                    display: block;
                    word-break: break-word;
                    flex: auto;
                    margin-left: 8px;
                    color: $color-black-80;
                    &:hover {
                        color: #1890ff;
                    }
                }
            }
        }
    }
}

</style>
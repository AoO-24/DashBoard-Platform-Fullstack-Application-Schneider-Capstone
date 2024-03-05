<!--话题内容-->
<template>
    <!-- 页头 -->
    <Header/>

    <div class="main">
        <div class="main-container wrap">
            <div class="topicContentModule">
                <div class="left" v-if="state.topic == undefined || state.topic == null  || Object.keys(state.topic).length==0" >
                    <div class="topic-wrap" style="padding: 20px 20px;">
                        <el-skeleton :loading="state.topic_loading"></el-skeleton>
                    </div>
                </div>
                <div class="left" v-if="state.topic != undefined && state.topic != null && Object.keys(state.topic).length>0">
                    <div class="topic-wrap" >
                        <div class="topicTag">
                            <router-link tag="a" class="tag" :to="{path:'/',query: {tagId: state.topic.tagId}}">
                                {{state.topic.tagName}}
                            </router-link>
                        </div>
                        <div class="rightInfo">
                            <div class="report" v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0" @click="addReportUI(state.topic.id,10)">
                                <span><Icon name="error-warning-line" size="16px" class="icon"/>举报</span>
                            </div>
                            <div class="editTopic" v-if="state.topic.userName == $store.state.systemUser.userName">
                                <router-link tag="a" :to="{path:'/user/editTopic',query: {topicId: state.topic.id}}">
                                    <Icon name="pencil-alt" size="16px" class="icon"/>编辑
                                </router-link>
                            </div>
                            <div class="ipAddress" v-if="state.topic.ipAddress != null && state.topic.ipAddress != ''">
                                <span><Icon name="map-pin-line" size="15px" class="icon"/>{{state.topic.ipAddress}}</span>
                            </div>
                        </div>
                        <div class="topicBox">
                            <div class="title">
                                {{state.topic.title}}
                                <span class="essence" v-if="state.topic.essence == true">精华</span>
                                <span class="top" v-if="state.topic.sort > 0">置顶</span>
                            </div>
                            <div class="topicInfo clearfix" >
                                <div class="postTime">{{state.topic.postTime}}</div>
                                <div class="viewTotal-icon"><Icon name="view" size="16px"/></div>
                                <div class="viewTotal">{{state.topic.viewTotal}}次阅读</div>
                                <div class="comment-icon"><Icon name="commentCount" size="16px"/></div>
                                <div class="comment">{{state.topic.commentTotal}}个评论</div>
                            </div>
                                 
                            <div :class="[state.topic.isMarkdown != null && state.topic.isMarkdown == true ? 'markdown-body-custom topicMarkdownContent' : 'topicContent', router.currentRoute.value.query.reportModule !=undefined && parseInt(router.currentRoute.value.query.reportModule as string) == 10 ? 'reportMark' : '']">
                               
                                <div class="lastUpdateTime" v-if="state.topic.lastUpdateTime != null">最后修改时间：{{state.topic.lastUpdateTime}}</div>
                               

                                <div class="cancelAccount" v-if="state.topic.account == null || state.topic.account == ''">此用户账号已注销</div>
                                  
                                <div :ref="el => {if(el) topicRefs['topic_'+state.topic.id] = el}">
                                   <RenderTemplate @click-onTopicUnhide="onTopicUnhide" @click-onDownload="onDownload" :html="state.topic.content"></RenderTemplate>
                                </div>
                            </div>


                            <div class="favorite-formModule" v-if="state.topic.userName != null && state.topic.userName != ''">
                                <!--加入收藏夹-->
                                <span class="numberButton" @click="addFavorite(state.topic.id)">
                                    <span class="button" >
                                        <span>{{state.alreadyCollected == true ? '已收藏':'收藏'}}</span>
                                    </span>
                                    <span class="number">{{state.favoriteCount}}</span>
                                </span> 
                                <!--给话题点赞-->
                                <span class="numberButton" @click="addLike(state.topic.id)">
                                    <span class="button" >
                                        <span>{{state.alreadyLiked == true ? '已赞':'赞'}}</span>
                                    </span>
                                    <span class="number">{{state.likeCount}}</span>
                                </span>
        
                            </div>
                        </div>
                    </div>

                    
					<!-- 评论列表 -->
					<div class="commentModule" v-if="state.commentList != null && Object.keys(state.commentList).length>0 && state.commentList.length >0">
                        <ol class="commentList">
                            <div class="commentInfo" :class="router.currentRoute.value.query.reportModule !=undefined && parseInt(router.currentRoute.value.query.reportModule as string) == 20 && comment.id == router.currentRoute.value.query.commentId ? 'reportMark' : ''" v-for="(comment,index) in state.commentList" :key="comment.id"  :ref="'comment_'+comment.id" >
                                <div class="comment-author">
                                    <router-link tag="a" v-if="comment.userName != null && comment.userName != ''" :to="{path:'/user/control/home',query: {userName: comment.userName}}">
                                        <img v-if="comment.avatarName != null" :src="comment.avatarPath+'100x100/'+comment.avatarName" class="img">
                                        <img v-if="comment.avatarName == null" :src="comment.avatar" width="62" height="62" class="img"/>
                                        
                                    </router-link>
                                    <img v-if="comment.userName == null && comment.avatarName == null" :src="comment.avatar" width="62" height="62" class="img"/>    
                                    
                                    <div class="info-container">
                                        <router-link tag="a" class="userName" :to="{path:'/user/control/home',query: {userName: comment.userName}}">
                                           <span v-if="comment.nickname != null && comment.nickname != ''">{{comment.nickname}}</span>
                                           <span v-if="comment.nickname == null || comment.nickname == ''">{{comment.account}}</span>
                                           <template v-if="comment.account == null || comment.account == ''">&nbsp;</template>
                                        </router-link>
                                        <span v-if="comment.account == null || comment.account == ''" class='cancelNickname'>已注销</span>   

                                        <span class="userRoleName" v-for="roleName in comment.userRoleNameList">{{roleName}}</span>
                                        <span class="staff" v-if="comment.isStaff">官方人员</span>
                                        <span class="master" v-if="comment.userName == state.topic.userName && comment.isStaff == state.topic.isStaff">作者</span>
                                    </div> 
                                </div>
                                <div class="commentTime">{{comment.postTime}}</div>
                                
                                <div class="quote" v-if="comment.quoteList != null && comment.quoteList.length >0">
                                    <RenderTemplate :html="state.quoteData.get(comment.id)"></RenderTemplate>
                                    
                                </div>
                                
                                <div :class="[comment.isMarkdown != null && comment.isMarkdown == true ? 'markdown-body-custom commentMarkdownContent' : 'commentContent']">
                                    <div class="cancelAccount" v-if="comment.account == null || comment.account == ''">此用户账号已注销</div>
                                   

                                    <div :ref="'commentContent_'+comment.id">
                                        <RenderTemplate :html="comment.content"></RenderTemplate>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                
                                <div class="replyList" v-if="comment.replyList != null && comment.replyList.length >0">
                                    <ul class="timeline box">
                                        <li class="timeline-item replyItem-container" v-for="(reply,index2) in comment.replyList" :key="reply.id"  :replyId="reply.id" :ref="handleReplyNodes">
                                 
                                            <div class="tail" v-if="state.line.get(reply.id)"></div>
                                            <div class="node node--normal" v-if="state.dot.get(reply.id)"></div>
                                            <div class="replyItem">
                                                <div :class="router.currentRoute.value.query.reportModule !=undefined && parseInt(router.currentRoute.value.query.reportModule as string) == 30 && reply.id == router.currentRoute.value.query.replyId ? 'reply-reportMark' : ''">
                                                    <div class="reply-top" >
                                                        <div class="reply-author">
                                                            <router-link tag="a" v-if="reply.userName!= null && reply.userName != ''" class="avatarBox" :to="{path:'/user/control/home',query: {userName: reply.userName}}">
                                                                <img v-if="reply.avatarName != null" :src="reply.avatarPath+'100x100/'+reply.avatarName" class="img">
                                                                <img v-if="reply.avatarName == null" :src="reply.avatar" width="40" height="40" class="img"/>
                                                                
                                                            </router-link>

                                                            <span v-if="reply.userName == null && reply.avatarName == null"  class="avatarBox">
                                                                <img :src="reply.avatar" width="40" height="40" class="img"/>
                                                            </span>
                                                        
                                                            <span v-if="reply.account == null || reply.account == ''" class='cancelNickname'>已注销</span>   


                                                            <router-link tag="a" v-if="reply.account != null && reply.account != ''" class="userName" :to="{path:'/user/control/home',query: {userName: reply.userName}}">
                                                                <span v-if="reply.nickname != null && reply.nickname != ''">{{reply.nickname}}</span>
                                                                <span v-if="reply.nickname == null || reply.nickname == ''">{{reply.account}}</span>
                                                                <template v-if=" reply.account == null || reply.account == ''">&nbsp;</template>
                                                            </router-link>

                                                            <span class="userRoleName" v-for="roleName in reply.userRoleNameList">{{roleName}}</span>
                                                            <span class="staff" v-if="reply.isStaff">官方人员</span>
                                                            <span class="master" v-if="reply.userName == state.topic.userName && reply.isStaff == state.topic.isStaff">作者</span>
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
                                                                
                                                                <span class="master" v-if="reply.friendAccount != null && reply.friendAccount != '' && reply.friendUserName == state.topic.userName && reply.isFriendStaff == state.topic.isStaff">作者</span>
                                                            
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
                                                                        <el-dropdown-item v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0"  @click="addReplyFriendUI(comment.id,reply.id)"><i class="dropdown-menu-icon" ><icon name="reply" size="15px"/></i> 回复 </el-dropdown-item>
                                                                        
                                                                        <el-dropdown-item v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0" @click="addReportUI(reply.id,30)"><i class="dropdown-menu-icon" ><icon name="error-warning-line" size="15px"/></i> 举报 </el-dropdown-item>
                                                                        
                                                                        <el-dropdown-item v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0 && reply.userName ==  $store.state.systemUser.userName" @click="editReplyUI(reply)"><i class="dropdown-menu-icon" ><icon name="pencil-alt" size="15px"/></i> 编辑 </el-dropdown-item>
                                                                        <el-dropdown-item v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0 && reply.userName ==  $store.state.systemUser.userName" @click="onDeleteReply(reply.id)"><i class="dropdown-menu-icon" ><icon name="trash" size="15px"/></i> 删除 </el-dropdown-item>
                                                                    </el-dropdown-menu>
                                                                </template>
                                                            </el-dropdown>

                                                        </span>
                                                        
                                                    </div>
                                                    <div style="clear:both; height: 0; line-height: 0; font-size: 0;"></div>
                                                    <div class="replyContent" @click="clickReplyLevel(comment.id,reply.id)">
                                                        <div v-if="reply.account == null || reply.account == ''" class="cancelAccount">此用户账号已注销</div>
                                                        {{reply.content}}
                                                    </div>
                                                    <!-- 修改回复 -->
                                                    <div class="editCommentReply-formModule" v-show="state.editReplyFormView.get(reply.id)">
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
                                                    <div class="addCommentReplyFriend-formModule" v-show="state.addReplyFriendFormView.get(reply.id)">
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
                                                                    <el-button class="submitButton" type="primary" @mousedown.native="onAddReplyFriend(comment.id,reply.id)" :disabled="state.allowSubmit.get('addReplyFriend-'+reply.id)">提交</el-button>
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
                                <div class="commentReply-formModule" v-show="state.addReplyFormView.get(comment.id)">
                                    <div class="addReply-wrap">
                                        <el-form label-position="right" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                            <el-form-item :error="error.replyContent.get('addReply-'+comment.id)">
                                                <el-input type="textarea" :autosize="{minRows: 6}" placeholder="请输入内容" v-model="state.addReplyContentField[index]"></el-input>
                                            </el-form-item>
                                            <el-form-item :error="error.captchaValue.get('addReply-'+comment.id)" v-if="state.showCaptcha.get('addReply-'+comment.id)" class="captcha-item">
                                                <el-row>
                                                    <el-col :span="10" >
                                                        <el-input  v-model="state.captchaValue['addReply-'+comment.id]" @change.native="checkCaptchaValueRules('addReply-'+comment.id)"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                            <template #prefix>
                                                                <Icon name="shield-check-line" size="16px"/>
                                                            </template>
                                                        </el-input>
                                                    </el-col>
                                                    <el-col :span="8" :offset="1">
                                                        <el-image :src="state.imgUrl.get('addReply-'+comment.id)" @click="replaceCaptcha('addReply-'+comment.id)"/>
                                                    </el-col>
                                                    <el-col :span="4" :offset="1">
                                                        <el-link type="primary" @click="replaceCaptcha('addReply-'+comment.id)" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                                    </el-col>
                                                </el-row>
                                            </el-form-item>
                                            <el-form-item :error="error.reply.get('addReply-'+comment.id)">
                                                <el-button class="submitButton" type="primary" @mousedown.native="onAddReply(comment.id)" :disabled="state.allowSubmit.get('addReply-'+comment.id)">提交</el-button>
                                                <el-button class="submitButton" type="primary" @mousedown.native="onCancelAddReply(comment.id);" plain >取消</el-button>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                               
                                <div class="quote-formModule" v-show="state.quoteFormView.get(comment.id)">
                                    <div class="addQuote-wrap">
                                        <div class="head"><Icon name="quote-left-solid" size="52px" class="icon"/></div>
                                        <el-form label-position="right" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                            <el-form-item :error="error.content.get('addQuoteComment-'+comment.id)">
                                                
                                                
                                                <div v-show="!state.isQuoteCommentMarkdownMap.get(comment.id)" style="width: 100%;">
                                                    <textarea :ref="handleQuoteNodes" :editorId="'quoteComment_'+comment.id" :commentId="comment.id" style="width:100%;height:230px;visibility:hidden;"></textarea>
                                                </div>
                                                <div v-if="state.isQuoteCommentMarkdownMap.get(comment.id)" style="width: 100%;">
                                                    <Editor mode="split" :editorId="'quoteComment_'+comment.id" :value="(state.quoteCommentMarkdownContent[comment.id] as string)" :plugins="state.quoteCommentEditorPlugin" :locale="zhHans" :sanitize="commentSanitize" placeholder="请输入内容..." @change="handleQuoteCommentMarkdownChange($event,comment.id)"/>
                                                </div>
                                            </el-form-item>
                                            <el-form-item :error="error.captchaValue.get('addQuoteComment-'+comment.id)" v-if="state.showCaptcha.get('addQuoteComment-'+comment.id)" class="captcha-item">
                                                <el-row>
                                                    <el-col :span="10" >
                                                        <el-input  v-model="state.captchaValue['addQuoteComment-'+comment.id]" @change.native="checkCaptchaValueRules('addQuoteComment-'+comment.id)"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                            <template #prefix>
                                                                <Icon name="shield-check-line" size="16px"/>
                                                            </template>
                                                        </el-input>
                                                    </el-col>
                                                    <el-col :span="8" :offset="1">
                                                        <el-image :src="state.imgUrl.get('addQuoteComment-'+comment.id)" @click="replaceCaptcha('addQuoteComment-'+comment.id)"/>
                                                    </el-col>
                                                    <el-col :span="4" :offset="1">
                                                        <el-link type="primary" @click="replaceCaptcha('addQuoteComment-'+comment.id)" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                                    </el-col>
                                                </el-row>
                                            </el-form-item>
                                            <el-form-item :error="error.comment.get('addQuoteComment-'+comment.id)" class="form-action">
                                                <el-button class="submitButton" type="primary"  @mousedown.native="onQuoteCommentFormSubmit(comment.id)" :disabled="state.allowSubmit.get('addQuoteComment-'+comment.id)">提交</el-button>
                                                <el-button class="submitButton" type="primary"  @mousedown.native="onCancelQuoteComment(comment.id)" plain>取消</el-button>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                               
                                
                                <!-- 修改评论表单 -->
                                <div class="editComment-formModule" v-show="state.editCommentFormView.get(comment.id)">
                                    <div class="editComment-wrap">
                                        <div class="head"><Icon name="pencil-alt" size="50px" class="icon"/></div>
                                        <el-form label-position="right" :ref="'formEditCommentRef-'+comment.id" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                            <el-form-item :error="error.content.get('editComment-'+comment.id)">
                                                <div v-show="!state.isEditCommentMarkdownMap.get(comment.id)" style="width: 100%;">
                                                    <textarea :ref="handleEditCommentNodes" :editorId="'editComment_'+comment.id" :commentId="comment.id" style="width:100%;height:230px;visibility:hidden;"></textarea>
                                                </div>
                                                <div v-if="state.isEditCommentMarkdownMap.get(comment.id)" style="width: 100%;">
                                                    <Editor mode="split" :editorId="'editComment_'+comment.id" :value="(state.editCommentMarkdownContent[comment.id] as string)" :plugins="state.editCommentEditorPlugin" :locale="zhHans" :sanitize="commentSanitize" placeholder="请输入内容..." @change="handleEditCommentMarkdownChange($event,comment.id)"/>
                                                </div>
                                            </el-form-item>
                                            <el-form-item :error="error.captchaValue.get('editComment-'+comment.id)" v-if="state.showCaptcha.get('editComment-'+comment.id)" class="captcha-item">
                                                <el-row>
                                                    <el-col :span="10" >
                                                        <el-input  v-model="state.captchaValue['editComment-'+comment.id]" @change.native="checkCaptchaValueRules('editComment-'+comment.id)"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                            <template #prefix>
                                                                <Icon name="shield-check-line" size="16px"/>
                                                            </template>
                                                        </el-input>
                                                    </el-col>
                                                    <el-col :span="8" :offset="1">
                                                        <el-image :src="state.imgUrl.get('editComment-'+comment.id)" @click="replaceCaptcha('editComment-'+comment.id)"/>
                                                    </el-col>
                                                    <el-col :span="4" :offset="1">
                                                        <el-link type="primary" @click="replaceCaptcha('editComment-'+comment.id)" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                                    </el-col>
                                                </el-row>
                                            </el-form-item>
                                            <el-form-item :error="error.comment.get('editComment-'+comment.id)" class="form-action">
                                                <el-button class="submitButton" type="primary"  @mousedown.native="onEditCommentFormSubmit(comment.id)" :disabled="state.allowSubmit.get('editComment-'+comment.id)">提交</el-button>
                                                <el-button class="submitButton" type="primary"  @mousedown.native="onCancelEditComment(comment.id)" plain>取消</el-button>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                                
                                <div class="tipBottom">
                                    <span class="a-toolbar">
                                        <span class="ipAddress-text" v-if="comment.ipAddress != null && comment.ipAddress != ''">
                                            <Icon name="map-pin-line" size="15px" class="icon"/>{{comment.ipAddress}}
                                        </span>
                                        <a v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0" @click="addReplyUI(comment.id)" >
                                            <Icon name="reply" size="15px" class="icon"/>回复
                                        </a>

                                        <a v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0" @click="quoteCommentUI(comment)">
                                            <Icon name="quote" size="15px" class="icon"/>引用
                                        </a>
                                        <span class="report" v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0" @click="addReportUI(comment.id,20)">
                                            <span><Icon name="error-warning-line" size="15px" class="icon"/>举报</span>
                                        </span>
                                       
                                        <a v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0 && comment.userName ==  $store.state.systemUser.userName" @click="editCommentUI(comment)">
                                            <Icon name="pencil-alt" size="15px" class="icon"/>编辑
                                        </a>
                                        
                                        <a v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0 && comment.userName ==  $store.state.systemUser.userName" @click="onDeleteComment(comment.id)">
                                            <Icon name="trash" size="15px" class="icon"/>删除
                                        </a>
                                        
                                    </span>
                                </div>
                            </div>
                        </ol>
                        <el-skeleton :loading="state.comment_loading" style="padding-top: 25px;"></el-skeleton>
                        <div class="page" v-if="state.isShowPage">
                            <el-pagination background @current-change="handlePage" :current-page="state.currentpage"  :page-size="state.maxresult" :total="state.totalrecord" layout="total, prev, pager, next,jumper" />
                        </div>
                    </div>

                    <!-- 话题允许评论 -->
                    <div v-if="state.topic.allow">
                        <!-- 已登录 -->
                        <div v-if="$store.state.systemUser != null && Object.keys($store.state.systemUser).length>0">
                            <!-- 显示评论表单 -->
                            <div class="comment-formModule" v-if="state.allowComment">
                                <div class="addComment-wrap">
                                    <el-form label-position="right" :ref="'formAddCommentRef'" size="large" :model="state" class="iconForm-container" @submit.native.prevent>
                                        <el-form-item :error="error.content.get('addComment-'+state.topicId)">
                                            <div v-show="!state.isAddCommentMarkdown" style="width: 100%;">
                                                <textarea :editorId="'addComment'" ref="formAddCommentContentRef" style="width:100%;height:230px;visibility:hidden;"></textarea>
                                            </div>
                                            <div v-if="state.isAddCommentMarkdown" style="width: 100%;">
                                                
                                                <Editor :editorId="'addComment'" :value="state.addCommentMarkdownContent" :plugins="state.addCommentEditorPlugin" :locale="zhHans" :sanitize="commentSanitize" placeholder="请输入内容..." @change="handleAddCommentMarkdownChange"/>
                                           
                                            </div>
                                        </el-form-item>

                                        <el-form-item :error="error.captchaValue.get('addComment-'+state.topicId)" v-if="state.showCaptcha.get('addComment-'+state.topicId)" class="captcha-item">
                                            <el-row>
                                                <el-col :span="10" >
                                                    <el-input  v-model="state.captchaValue['addComment-'+state.topicId]" @change.native="checkCaptchaValueRules('addComment-'+state.topicId)"  class="captchaInput" maxlength="4" placeholder="验证码" clearable >
                                                        <template #prefix>
                                                            <Icon name="shield-check-line" size="16px"/>
                                                        </template>
                                                    </el-input>
                                                </el-col>
                                                <el-col :span="8" :offset="1">
                                                    <el-image :src="state.imgUrl.get('addComment-'+state.topicId)" @click="replaceCaptcha('addComment-'+state.topicId)"/>
                                                </el-col>
                                                <el-col :span="4" :offset="1">
                                                    <el-link type="primary" @click="replaceCaptcha('addComment-'+state.topicId)" :underline="false" class="replaceCaptchaText">换一幅</el-link>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item :error="error.comment.get('addComment-'+state.topicId)" class="form-action">
                                            <el-button class="submitButton" type="primary"  @mousedown.native="onAddCommentFormSubmit" :disabled="state.allowSubmit.get('addComment-'+state.topicId)">提交</el-button>
                                            <div class="promptInfo">
                                                <h2>我来说两句，发表我的评论</h2>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                            <!-- 不显示评论表单 -->       
                            <div class="addCommentModule" v-if="!state.allowComment">
                                <div class="addComment-wrap">
                                    <div class="respond">
                                        <p>
                                            评论已关闭
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
		
                        <!-- 未登录 -->
                        <div class="addCommentModule" v-if="$store.state.systemUser == null || Object.keys($store.state.systemUser).length==0">
                            <div class="addComment-wrap">
                                <div class="respond">
                                    <p >请 
                                    <router-link tag="a" :to="'/login'">登录</router-link>
                                        后评论。没有帐号？
                                        <router-link tag="a" :to="'/register'">注册</router-link> 一个。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 话题不允许评论 -->
					<div class="addCommentModule" v-if="!state.topic.allow">
                        <div class="addComment-wrap">
                            <div class="respond">
                                <p>
                                    本话题评论已关闭
                                </p>
                            </div>
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
                                <div class="userInfo-wrap clearfix" v-if="state.topic == undefined || state.topic == null  || Object.keys(state.topic).length==0" >
                                    <div class="userInf" style="padding: 20px 20px;">
                                        <el-skeleton :loading="state.topic_loading"></el-skeleton>
                                    </div>
                                </div>
                                <!-- 话题用户信息 -->
                                <div class="userInfo-wrap clearfix" v-if="state.topic != undefined && state.topic != null && Object.keys(state.topic).length>0">
                                    <div class="userInfo">
                                        <div class="author">
                                            <router-link v-if="state.topic.userName != null && state.topic.userName != ''" tag="a" :to="{path:'/user/control/home',query: {userName: state.topic.userName}}" target="_blank">
                                                <img v-if="state.topic.avatarName != null" :src="state.topic.avatarPath+'100x100/'+state.topic.avatarName" class="img">
                                                <img v-if="state.topic.avatarName == null" :src="state.topic.avatar" width="70" height="70" class="img"/>
                                                
                                            </router-link>
                                            <a v-if="state.topic.userName == null || state.topic.userName == ''">
                                                <img v-if="state.topic.avatarName != null" :src="state.topic.avatarPath+'100x100/'+state.topic.avatarName" class="img">
                                                <img v-if="state.topic.avatarName == null" :src="state.topic.avatar" width="70" height="70" class="img"/>
                                                
                                            </a>
                                        </div>
                                        <p class="name">
                                            <router-link tag="a" :to="{path:'/user/control/home',query: {userName: state.topic.userName}}" target="_blank">
                                                {{state.topic.nickname != null && state.topic.nickname != '' ?state.topic.nickname : state.topic.account}}
                                            </router-link>
                                        </p>
                                        <div class="role" v-if="state.topic.userRoleNameList != null && state.topic.userRoleNameList.length >0">
                                            <i class="userRoleName" v-for="roleName in state.topic.userRoleNameList">{{roleName}}</i>
                                        </div>
                                        
                                        <div class="role" v-if="state.topic.isStaff">
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
                                        <div class="action-button" v-if="!state.topic.isStaff && state.topic.userName != null && state.topic.userName != ''">
                                            <!-- 关注用户 -->
                                            <span class="action-followBox" >
                                                <el-button type="primary" @click="addFollow(state.topic.userName)">{{state.followText}}</el-button>
                                            </span>
                                            <span class="privateMessageBox" >
                                                <el-button type="primary" plain @click="toPrivateMessage(state.topic.userName)">发私信</el-button>
                                            </span>
                                        </div>
                                        
                                    </div>
                                </div>

                                <!-- 红包 -->
                                <div class="redEnvelopeModule clearfix" v-if="state.topic != undefined && state.topic != null  && Object.keys(state.topic).length >0 && state.giveRedEnvelope != undefined && state.giveRedEnvelope != null && Object.keys(state.giveRedEnvelope).length >0">
                                    <!-- 还有未被领取的红包 -->
                                    <div class="redEnvelope" v-if="state.giveRedEnvelope.remainingQuantity >0">
                                        <div class="box">
                                            <div class="head-bg">
                                                <div class="head"></div>
                                            </div>
                                            <div class="body">
                                                <div class="content">
                                                    <span class="avatarBox" >
                                                        <img v-if="state.giveRedEnvelope.avatarName != null" :src="state.giveRedEnvelope.avatarPath+'100x100/'+state.giveRedEnvelope.avatarName" >
                                                        <img v-if="state.giveRedEnvelope.avatarName == null" :src="state.giveRedEnvelope.avatar" width="48" height="48"/>
                                                    </span>
                                                    <span>给大家发个红包</span>
                                                </div>
                                            </div>
                                            <div id="open" class="open-btn" v-if="state.giveRedEnvelope.accessUserUnwrap">已拆</div>
                                        
                                            <template v-if="!state.giveRedEnvelope.accessUserUnwrap">
                                                <div id="notOpen" class="btn"  @click="grabRedEnvelope(state.giveRedEnvelope.id)">开</div>
                                                <div id="open" class="open-btn" style="display: none;">已拆</div>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="noRedEnvelope" v-if="state.giveRedEnvelope.remainingQuantity ==0">
                                        <div class="box">
                                            <div class="content">您来晚了，红包已被抢光</div>
                                        </div>
                                    </div>
                                
                            
                                
                                    <!-- 已领取红包用户 -->
                                    <div class="receiveRedEnvelopeUser" v-if="state.receiveRedEnvelopeList != undefined && state.receiveRedEnvelopeList != null && state.receiveRedEnvelopeList.length >0">
                                        
                                        <div class="box">
                                            <el-tooltip popper-class="popper-transparent"  effect="dark" :hide-after="0" :show-after="100" placement="top-start" v-for="(receiveRedEnvelope,index) in state.receiveRedEnvelopeList" >
                                                <template #content>
                                                    <template v-if="receiveRedEnvelope.receiveAccount != null && receiveRedEnvelope.receiveAccount !=''">
                                                        <span v-if="receiveRedEnvelope.receiveNickname != null && receiveRedEnvelope.receiveNickname !=''">{{receiveRedEnvelope.receiveNickname}}</span>
                                                        <span v-if="receiveRedEnvelope.receiveNickname == null || receiveRedEnvelope.receiveNickname ==''">{{receiveRedEnvelope.receiveAccount}}</span>
                                                        <span>获得 {{receiveRedEnvelope.amount}} 元</span>
                                                    </template> 
                                                    
                                                    <span v-if="(receiveRedEnvelope.receiveAvatarName == null || receiveRedEnvelope.receiveAvatarName=='') && (receiveRedEnvelope.receiveAccount == null || receiveRedEnvelope.receiveAccount =='')">此用户账号已注销 获得 {{receiveRedEnvelope.amount}} 元</span>

                                                </template>
                                                <img v-if="receiveRedEnvelope.receiveAvatarName != null && receiveRedEnvelope.receiveAvatarName != ''" class='avatar'  :src="receiveRedEnvelope.receiveAvatarPath+'100x100/'+receiveRedEnvelope.receiveAvatarName"/>
                                                <img v-if="(receiveRedEnvelope.receiveAvatarName == null || receiveRedEnvelope.receiveAvatarName=='') && (receiveRedEnvelope.receiveAccount != null && receiveRedEnvelope.receiveAccount !='')" class='avatar' :src="receiveRedEnvelope.receiveAvatar"/>

                                                <img v-if="(receiveRedEnvelope.receiveAvatarName == null || receiveRedEnvelope.receiveAvatarName=='') && (receiveRedEnvelope.receiveAccount == null || receiveRedEnvelope.receiveAccount =='')" class='avatar' :src="receiveRedEnvelope.receiveAvatar"/>
                                            </el-tooltip>
                                        </div>
                                        <div class="more" v-if="state.receiveRedEnvelope_more">
                                            <Icon name="angle-down" size="15px" class="icon" title="更多" @click="queryReceiveRedEnvelopeUser(state.giveRedEnvelope.id,state.receiveRedEnvelopeCurrentPage+1)"/>
                                        </div>
                                    </div>
                                </div>
                                <!--  相似话题 集合 -->
                                <div class="likeTopicModule clearfix" v-if="state.likeTopicList != null && state.likeTopicList.length >0">
                                    <div class="likeTopic">
                                        <div class="title">相关话题</div>
                                        <ul class="topicList">
                                            <li class="topic-title " v-for="likeTopic in state.likeTopicList">
                                                <router-link tag="a" :to="{path: '/thread', query:{ topicId : likeTopic.id}}">
                                                    {{likeTopic.title}}
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
    import { onMounted, ref ,nextTick, getCurrentInstance, ComponentInternalInstance, reactive, onUnmounted, computed,onUpdated, watch, watchEffect, onBeforeUpdate,} from 'vue'
    import { ElImage, ElMessage, ElMessageBox, UploadFile, UploadProps, UploadRawFile, UploadUserFile} from 'element-plus'
    import { appStore } from "@/store";
    import { useActiveMeta, useMeta} from 'vue-meta'
    import { onBeforeRouteUpdate, useRouter } from 'vue-router'
    import { PageView,Topic,Comment, Reply, GiveRedEnvelope, ReceiveRedEnvelope, ReportType } from "@/types/index";
    import { AxiosResponse } from 'axios';
    import { letterAvatar } from '@/utils/letterAvatar';
    import Icon from "@/components/icon/Icon.vue";
    import Long from "long";
    import Hls from 'hls.js';
    import DPlayer from 'dplayer';
    import { escapeHtml, escapeVueHtml, unescapeHtml } from '@/utils/escape';
    import { getAllUrlParam, getLanguageClassName, processErrorInfo } from '@/utils/tool';
    import { createEditor } from '@/utils/editor';
    import Prism from "prismjs";
    import {nativeQueryVideoRedirect, nativeRefreshToken } from '@/utils/http';
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

    //const formAddCommentRef = ref<FormInstance>();
    const formAddCommentContentRef = ref()
    const right_ref = ref()

    //话题内容
    const topicRefs = ref({}) as any;
   
    
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
        if(titleValue != null && titleValue != '' && state.topic != null && Object.keys(state.topic).length > 0){
            meta.title = (state.topic.title != null ? state.topic.title : '') + ' - ' + computed(() => store.state.title).value;		
            meta.meta[0].content = (state.topic.title != null ? state.topic.title : '') +  ' - ' + computed(() => store.state.title).value;
            meta.meta[1].content = (state.topic.title != null ? state.topic.title : '') +  ' - ' + computed(() => store.state.title).value;
        }
    }, {
        flush: 'post'//在组件更新后触发，第一次运行需要组件渲染完成才执行
    })
    
    const state = reactive({
        topicId:'',
        topic: {} as Topic,
        topic_loading:true,//是否显示话题骨架屏
  
        playerIdList: [] as Array<string>,//视频播放Id列表
		playerObjectList: [] as Array<any>,//视频播放对象集合
        playerHlsList: [] as Array<any>,//视频播放流对象集合
		playerNodeList: [] as Array<any>,//视频节点对象集合



        alreadyCollected :false,//用户是否已经收藏话题
        favoriteCount : 0,//话题用户收藏总数
        alreadyLiked:false,//用户是否已经点赞该话题
        likeCount : 0,//话题用户点赞总数
        hidePasswordIndex:0,//隐藏标签密码框索引
        isReplyTopicVisible:false,//是否包含回复话题可见隐藏标签

        commentList:{} as Array<Comment>,
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        comment_loading:true,//是否显示评论骨架屏
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
        

        allowComment:false,//是否显示评论表单
        availableTag:[] as Array<string>,//评论编辑器允许使用标签
        fileSystem:0,//文件存储系统
        supportEditor:10,//支持编辑器
        addCommentMarkdownContent:'',//markdown评论内容
        isAddCommentMarkdown:false,//是否使用markdown评论编辑器




        addCommentEditor :{} as any,//添加评论编辑器
        addCommentEditorCreateParameObject :{} as any,//添加评论编辑器的创建参数
        
        
        quoteFormView : new Map(),//评论引用表单  key:评论Id value:是否显示
        quoteEditorMap:new Map(),//引用评论富文本编辑器集合 key:评论Id value:富文本编辑器
        quoteEditorCreateParameMap:new Map(),//引用评论编辑器的创建参数 key:评论Id value:编辑器参数对象
        quoteData : new Map(),//引用数据 map格式 key:评论Id value:引用html数据

        
        isQuoteCommentMarkdownMap: new Map(),//引用评论是否使用markdown编辑器  key:评论Id value:是否为markdown编辑器
        quoteCommentMarkdownContent : {} as any,//引用评论markdown编辑内容 key:评论Id value:评论内容
        


        editCommentFormView : new Map(),//修改评论表单  key:评论Id value:是否显示
        editCommentEditorMap:new Map(),//修改评论富文本编辑器集合 key:评论Id value:富文本编辑器
        editCommentEditorCreateParameMap:new Map(),//修改评论编辑器的创建参数 key:评论Id value:编辑器参数对象
       

        isEditCommentMarkdownMap: new Map(),//修改评论是否使用markdown编辑器  key:评论Id value:是否为markdown编辑器
        editCommentMarkdownContent : {} as any,//修改评论markdown编辑内容 key:评论Id value:评论内容

        isPageCall :false,//是否由分页按钮调用


        quoteElementNodes:[] as any,//引用评论项Element节点集合
		editCommentElementNodes:[] as any,//修改评论项Element节点集合
		replyElementNodes:[] as any,//回复列表项Element节点集合

        addReplyContentField : [] as any, //添加回复内容项绑定
		addReplyFormView : new Map(),//添加回复表单  key:评论Id value:是否显示

		editReplyContentField : [] as any, //修改回复内容项绑定(二维数组)
		editReplyFormView : new Map(),//修改回复表单  key:回复Id value:是否显示

        showCaptcha:new Map<string,boolean>(),//是否显示验证码  本项及以下几项的key格式为 key:模块+id  例如：添加评论key=addComment-话题Id   修改评论key=editComment-评论Id    添加引用评论key=addQuoteComment-评论Id    添加回复key=addReply-评论Id   修改回复key=editReply-回复Id
        captchaKey: new Map<string,string>(),//验证码key
        captchaValue: {} as any,//验证码值
        imgUrl: new Map<string,string>(),//验证码图片
        allowSubmit:new Map<string,boolean>(),//提交按钮disabled状态

        followerCount:'0',//粉丝总数
        followText:'关注',//关注文本
        answerCount:'0',//回答总数
        followCount:'0',//关注总数

        giveRedEnvelope :{} as GiveRedEnvelope,//红包
        receiveRedEnvelopeList:[] as Array<ReceiveRedEnvelope>,//领取红包用户集合
		selectedReceiveRedEnvelopeId:'',//选中领取红包用户
		receiveRedEnvelopeCurrentPage:0,//领取红包用户当前页
		receiveRedEnvelope_more:false,//是否显示更多领取红包用户
        
        likeTopicList:[] as Array<Topic>, //相似话题集合

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


        addCommentEditorPlugin:[] as BytemdPlugin[],//添加评论Markdown编辑器插件
        quoteCommentEditorPlugin:[] as BytemdPlugin[],//引用评论Markdown编辑器插件
        editCommentEditorPlugin:[] as BytemdPlugin[],//修改评论Markdown编辑器插件
    });

     //错误
     const error = reactive({
        content : new Map<string,string>(),//评论和引用内容错误
        replyContent: new Map<string,string>(),//回复内容错误
        captchaValue : new Map<string,string>(),
        comment: new Map<string,string>(),//评论和引用错误
        reply: new Map<string,string>(),//回复错误
        reportTypeId:'',//举报分类Id
        reason:'',//举报理由
        imageFile:'',//举报图片
        report:''//举报
    })

    //评论ref节点处理
    const handleEditCommentNodes = (el: any) => {
        if(el != null){
            state.editCommentElementNodes.push(el);
        }
    }
    //引用评论ref节点处理
    const handleQuoteNodes =(el: any) => {
        if(el != null){
            state.quoteElementNodes.push(el);
        }
    }
    //回复ref节点处理
	const handleReplyNodes = (el: any) => {
        if(el != null){
            state.replyElementNodes.push(el);
        }
	}



    //处理添加评论Markdown
    const handleAddCommentMarkdownChange = (value: string) => {
        state.addCommentMarkdownContent = value;
    }

    //评论白名单
    const commentSanitize = (schema: any) => {
        schema = sanitize(schema);
        return schema;
    }


     //处理切换到富文本编辑器
     const handleAddCommentToggleRichtextEditor = (editorId: string) => {
        state.isAddCommentMarkdown = false;
        nextTick(()=>{
            if (Object.keys(state.addCommentEditorCreateParameObject).length != 0) {//不等于空
                //创建富文本编辑器
                state.addCommentEditor = createEditor(
                    state.addCommentEditorCreateParameObject.ref, 
                    state.addCommentEditorCreateParameObject.availableTag, 
                    state.addCommentEditorCreateParameObject.uploadPath, 
                    state.addCommentEditorCreateParameObject.userGradeList,
                    state.fileSystem,
                    ()=>{
                        handleAddCommentToggleMarkdownEditor(editorId);
                    }
                );
            }
        })
    }

    //处理添加评论切换到Markdown编辑器
    const handleAddCommentToggleMarkdownEditor = (editorId: string) => {
        if (Object.keys(state.addCommentEditor).length != 0) {//不等于空
            state.addCommentEditor.remove();
            state.addCommentEditor = {};
        }
        state.isAddCommentMarkdown = true;
    }


    //处理引用评论Markdown
    const handleQuoteCommentMarkdownChange = (value: string, commentId: string) => {
       Object.assign(state.quoteCommentMarkdownContent, {[commentId] : value});
    }


    //处理引用评论切换到富文本编辑器
    const handleQuoteCommentToggleRichtextEditor = (editorId: string) => {
        let commentId = editorId.split("_")[1];
        state.isQuoteCommentMarkdownMap.set(commentId,false);

        nextTick(()=>{
            
            let quoteEditorCreateParameObject = state.quoteEditorCreateParameMap.get(commentId);
          
            if (quoteEditorCreateParameObject !=undefined && Object.keys(quoteEditorCreateParameObject).length != 0) {//不等于空
                
                //创建富文本编辑器
                let quoteCommentEditor = createEditor(
                    quoteEditorCreateParameObject.ref, 
                    quoteEditorCreateParameObject.availableTag, 
                    quoteEditorCreateParameObject.uploadPath, 
                    quoteEditorCreateParameObject.userGradeList,
                    state.fileSystem,
                    ()=>{
                        handleQuoteCommentToggleMarkdownEditor(editorId);
                    }
                );
                state.quoteEditorMap.set(commentId, quoteCommentEditor);
            }
        })
    }

    //处理引用评论切换到Markdown编辑器
    const handleQuoteCommentToggleMarkdownEditor = (editorId: string) => {
        let commentId = editorId.split("_")[1];

        let quoteEditor = state.quoteEditorMap.get(commentId);
        if (quoteEditor !=undefined && Object.keys(quoteEditor).length != 0) {//不等于空
            quoteEditor.remove();
            quoteEditor = {};
        }

        state.isQuoteCommentMarkdownMap.set(commentId,true);                
    }


    //处理修改评论Markdown
    const handleEditCommentMarkdownChange = (value: string, commentId: string) => {
       Object.assign(state.editCommentMarkdownContent, {[commentId] : value});
    }




    //话题解锁
    const onTopicUnhide = (hideType: number,hidePassword: string) => {
        let formData = new FormData();
        formData.append('topicId', state.topicId);
        formData.append('hideType',  String(hideType));
        if(hideType == 10){
            if(hidePassword != undefined && hidePassword != ""){
                formData.append('password',  hidePassword);
            }else{
                ElMessage({
                    showClose: true,
                    message: '密码不能为空',
                    type: 'error',
                })
                return;
            }
        }

        ElMessageBox.confirm('确定解锁?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定',
            lockScroll: false,
        })
        .then(() => {
            proxy?.$axios({
                url: '/user/control/topic/unhide',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(JSON.parse(result.success)){
                        ElMessage({
                            showClose: true,
                            message: '话题解锁成功',
                            type: 'success',
                            onClose:()=>{
                                
                            }
                        })
                        //查询话题
                        queryTopic(state.topicId,()=>{});//调用父组件方法
                    }else{
                        //处理错误信息
                        processErrorInfo(result.error as Map<string,string> ,  error,()=>{});
                        
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

   
    //查询话题
    const queryTopic = (topicId: string,callback :any) => {
		proxy?.$axios({
            url: '/thread',
            method: 'get',
            params:  { 
                topicId: topicId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: Topic) => {
            if(data){
                //清空播放器
                clearVideoPlayer();               
                //处理自定义标签
                let contentNode = document.createElement("div");
                contentNode.innerHTML = data.content;
                bindNode(contentNode);
               
                data.content = escapeVueHtml(contentNode.innerHTML);

                
                state.topic = data;

                if(state.topic.nickname != null && state.topic.nickname !=''){
                    state.topic.avatar = letterAvatar(state.topic.nickname, 70);
                }else{
                    state.topic.avatar = letterAvatar(state.topic.account, 70);
                }


                nextTick(()=>{
                    setTimeout(function() {
                        renderVideoPlayer();//渲染视频播放器
                    }, 30);
                    
                    //渲染代码
                    let topicRefValue = topicRefs.value['topic_'+state.topicId]
                    if(topicRefValue != undefined){
                        renderBindNode(topicRefValue); 
                    }
                });


                //回调
                callback();
            }
            state.topic_loading = false;//是否显示话题骨架屏
        })
        .catch((error: any) =>{
            console.log(error);
        });
	}



     //查询评论列表
     const queryCommentList = (topicId: string,commentId: string, replyId: string, page:number|undefined) => {
        let params = {} as any;
        params.topicId = topicId;
        if(commentId != null && commentId != ''){
            params.commentId = commentId;
        }
        if(page != undefined){
            params.page = page;
        }

        proxy?.$axios({
            url: '/queryCommentList',
            method: 'get',
            params:  params,
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            return response?.data
        })
        .then((data: PageView<Comment>) => {
            if(data){
                 //清空
                state.quoteElementNodes.length = 0;
                state.editCommentElementNodes.length = 0;

                state.editReplyContentField.length = 0;

            


                state.commentList = {} as Array<Comment>;


                if(data.records != null && data.records.length >0){
                    for(let i:number=0; i<data.records.length; i++){
                        let comment = data.records[i];
                        if(comment.nickname != null && comment.nickname !=''){
                            comment.avatar = letterAvatar(comment.nickname, 60);
                        }else{
                            comment.avatar = letterAvatar(comment.account, 60);
                        }

                        if(comment.replyList != null && comment.replyList.length >0){
                            for(let j:number=0; j<comment.replyList.length; j++){
                                let reply = comment.replyList[j];
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
                        

                        //组装引用数据
                        if(comment.quoteList != null && comment.quoteList.length >0){
                            let quoteContent = "";
                            for (let j = 0; j <comment.quoteList.length; j++) {
                                let quote = comment.quoteList[j];

                                let avatarHtml = "";
                                if(quote.account != null && quote.account != ''){
                                    avatarHtml += "<router-link class=\"avatarBox\"  tag=\"a\" :to=\"{path: '/user/control/home', query: {userName: '"+quote.userName+"'}}\">";
                                    if(quote.avatarName != undefined && quote.avatarName != null && quote.avatarName != ''){
                                        avatarHtml += "<img src=\""+quote.avatarPath+"100x100/"+quote.avatarName+"\">";			
                                    }		
                                    if(quote.avatarName == undefined || quote.avatarName == null || quote.avatarName == ''){
                                        let char = (quote.nickname != null && quote.nickname != '') ? quote.nickname : quote.account;
                                        let width = 30;//头像宽
                                        avatarHtml += "<img src=\""+letterAvatar(char, width)+"\">";
                                        
                                    }
                                    avatarHtml += "</router-link>";
                                }
                                
                                if(quote.account == null || quote.account == ''){
                                    avatarHtml += "<span class='avatarBox'>";
                                    if(quote.avatarName != undefined && quote.avatarName != null && quote.avatarName != ''){
                                        avatarHtml += "<img src=\""+quote.avatarPath+"100x100/"+quote.avatarName+"\">";			
                                    }		
                                    if(quote.avatarName == undefined || quote.avatarName == null || quote.avatarName == ''){
                                        let char = (quote.nickname != null && quote.nickname != '') ? quote.nickname : quote.account;
                                        let width = 30;//头像宽
                                        avatarHtml += "<img src=\""+letterAvatar(char, width)+"\">";
                                        
                                    }
                                    avatarHtml += "</span>";
                                    avatarHtml += "<span class='cancelNickname'>已注销</span>";
                                    
                                }

                                let quoteCancelAccountHtml = "";
                                if(quote.account == null || quote.account == ''){
                                    quoteCancelAccountHtml = "<div class='cancelAccount'>此用户账号已注销</div>";
                                }

                                quoteContent = "<div class=\"quoteComment\">"+quoteContent+"<span class=\"userName\">"+avatarHtml+"<router-link tag=\"span\" :to=\"{path: '/user/control/home', query: {userName: '"+quote.userName+"'}}\">"+(quote.nickname != null && quote.nickname != '' ? escapeHtml(quote.nickname) : escapeHtml(quote.account))+"</router-link>&nbsp;的评论：</span><br/><div class=\"quoteContent\">"+quote.content+quoteCancelAccountHtml+"</div></div>";
        
                                
                            }
                            
                            state.quoteData.set(comment.id, escapeVueHtml(quoteContent));
                        }


                        //定义回复数组
                        let editReplyContentField_reply_array = [];
                        
                        //回复
                        if(comment.replyList != null && comment.replyList.length >0){
                            for (let j = 0; j <comment.replyList.length; j++) {
                                let reply = comment.replyList[j];
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
                        contentNode.innerHTML = comment.content;
                        bindNode(contentNode);
                        comment.content = escapeVueHtml(contentNode.innerHTML);



                    }
                }



                state.commentList = data.records;
                state.totalrecord = parseInt(data.totalrecord);//服务器返回的long类型已转为String类型
                state.currentpage = data.currentpage;
                state.totalpage = parseInt(data.totalpage);//服务器返回的long类型已转为String类型
                state.maxresult = data.maxresult;

                state.comment_loading = false;//是否显示评论骨架屏
                state.isShowPage = true;//显示分页栏


                nextTick(()=> {
                    //跳转到锚点
                   // window.scrollTo(0,0);

                    //跳转到评论
                    if(commentId != null && commentId != '' && (replyId == null || replyId == '')){
                        let commentRef = (proxy?.$refs['comment_'+commentId] as any);
                        if(commentRef !=undefined){
                            let commentRefValue = commentRef[0];
                            window.scrollTo(0,commentRefValue.getBoundingClientRect().top-10);

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
                    if(state.isPageCall && page != undefined && (commentId == null || commentId == '') && (replyId == null || replyId == '')){
                        let top = (document.querySelector(".commentModule") as any).offsetTop
                        window.scrollTo(0,top-10); //切换路由之后滚动到评论模块
                    }
                    state.isPageCall = false;


                    if(data.records != null && data.records.length > 0){
                        for (let i = 0; i <data.records.length; i++) {
                            let comment = data.records[i];
                            let commentRefValue =  (proxy?.$refs['commentContent_'+comment.id] as any);
                            if(commentRefValue != undefined && commentRefValue[0]){
                                renderBindNode(commentRefValue[0]); 
                            }
                            
                        }
                    }
                });
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //分页
    const handlePage = (page: number) => {
           
        state.editCommentFormView.clear() //修改评论表单
        state.editCommentEditorMap.clear()//修改评论富文本编辑器集合
        state.editCommentEditorCreateParameMap.clear()//修改评论编辑器的创建参数

        state.quoteFormView.clear() //评论引用表单
        state.quoteEditorMap.clear()//引用评论富文本编辑器集合
        state.quoteEditorCreateParameMap.clear()//引用评论编辑器的创建参数


        //标记由分页方法调用
        state.isPageCall = true;

		router.push({
            path: '/thread', 
            query:{
                topicId:state.topicId,
                page : page
            }
		});

	}


	//清空播放器
    const clearVideoPlayer = () => {
        for(let i=0; i< state.playerObjectList.length; i++){
            let playerObject = state.playerObjectList[i];
            
            playerObject.destroy();//销毁播放器
        }
        for(let i=0; i< state.playerHlsList.length; i++){
            let hls = state.playerHlsList[i];
            hls.destroy();//销毁视频流
        }
        state.playerObjectList.length = 0;//清空数组
        state.playerHlsList.length = 0;//清空数组
        state.playerIdList.length = 0;//清空数组
        state.playerNodeList.length = 0;//清空数组
    }






    //渲染视频播放器
    const renderVideoPlayer = () => {
        
        for(let i=0; i< state.playerIdList.length; i++){
            let playerId = state.playerIdList[i];
            let url = document.getElementById(playerId)?.getAttribute("url");
            let cover = document.getElementById(playerId)?.getAttribute("cover");//封面
            let thumbnail = document.getElementById(playerId)?.getAttribute("thumbnail");//缩略图
            
            let dp = null;
            if(url == ""){//如果视频处理中
                dp = new DPlayer({
                    container: document.getElementById(playerId),//播放器容器元素
                    screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                    
                    video: {
                        
                    }
                });
                let dom = document.createElement('div');
                dom.innerHTML="<div class='dplayer-process'><div class='box'><div class='prompt'>视频处理中，请稍后再刷新</div></div></div>";
                document.getElementById(playerId)?.appendChild(dom);
            }else{

                if(cover != undefined && cover != "" && thumbnail != undefined && thumbnail != ""){//切片视频
                    let hls = null;
                    dp = new DPlayer({
                        container: document.getElementById(playerId),//播放器容器元素
                        screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                        
                        video: {
                            url: url,
                            pic: cover,//视频封面
                            thumbnails: thumbnail,//视频预览图
                            type: 'customHls',
                            customType: {
                                customHls: function (video:any, player:any) {
                                    hls = new Hls();
                                    hls.loadSource(video.src);
                                    hls.attachMedia(video);
                                    hls.config.xhrSetup = (xhr, url) => {
                                        
                                        if(url.startsWith(store.state.apiUrl+"videoRedirect?")){//如果访问视频重定向页
                                            //如果使用重定向跳转时会自动将标头Authorization发送到seaweedfs，seaweedfs会报501错误 A header you provided implies functionality that is not implemented
                                            //这里发送X-Requested-With标头到后端，让后端返回需要跳转的地址
                                            let videoRedirectDate = {} as any;
                                            nativeQueryVideoRedirect(url,function(date:any){
                                                if(store.state.systemUser != null && Object.keys(store.state.systemUser).length>0 && date.isLogin == false && date.isPermission == false){
                                                    //会话续期
                                                    nativeRefreshToken();
                                                    nativeQueryVideoRedirect(url,function(date:any){
                                                        videoRedirectDate = date;
                                                    });
                                                }else{
                                                    videoRedirectDate = date;
                                                }
                                                
                                            });

                                            if(videoRedirectDate != null && Object.keys(videoRedirectDate).length>0 && videoRedirectDate.redirect != ''){
                                                //告诉hls重新发送ts请求
                                                xhr.open("GET", videoRedirectDate.redirect, true);//用重定向后的地址请求
                                                //xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                                            }
                                        }else{
                                            // 请求ts的url 添加参数 props.fileid
                                            //url = url + "?t=" + props.fileid;
                                            // 这一步必须 告诉hls重新发送ts请求
                                            xhr.open("GET", url, true);
                                            //xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                                        }
                                    };
                                },
                            },
                        }
                    });
                    state.playerHlsList.push(hls);
                }else{
                    dp = new DPlayer({
                        container: document.getElementById(playerId),//播放器容器元素
                        screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                        
                        video: {
                            url: url
                        }
                    });
                }
                
            }
            state.playerObjectList.push(dp);
        }
        
        
        //添加播放器节点数据
        if(state.playerObjectList.length >0){
            
            for(let i=0; i< state.playerIdList.length; i++){
                let playerId = state.playerIdList[i];
                let node = document.getElementById(playerId);//节点对象
                state.playerNodeList.push(node);
            }
        }
        
    }

    //文件下载
    const onDownload = (href: string) => {
        let regx = new RegExp("^"+store.state.apiUrl,"i");//忽略大小写
        let path = href.replace(regx,"")

        proxy?.$axios({
            url: '/'+path,
            method: 'get',
            params:  {
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(JSON.parse(result.success)){
                    location.href = result.redirect;
                }
            }
        }).catch((error: any) =>{
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
                //处理隐藏内容
                if(childNode.nodeName.toLowerCase() == "hide" ){
                    if(childNode.getAttribute("hide-type") == "10"){//输入密码可见
                        var nodeHtml = "";
                        nodeHtml += '<div class="hide-box">';
                        nodeHtml += 	'<Icon name="lock-solid-2" size="52px" class="background-image"></Icon>';
                        nodeHtml += 	'<div class="background-prompt">此处内容已被隐藏，输入密码可见</div>';
                        nodeHtml += 	'<div class="input-box">';
                        nodeHtml += 		'<input type="password" v-model.trim="hide_passwordList['+state.hidePasswordIndex+']" class="text" maxlength="30"  placeholder="密码">';
                      //  nodeHtml += 		'<input type="button" value="提交" class="button" @click="topicUnhide(10,'+state.hidePasswordIndex+');">';
                        nodeHtml += 		'<div class="button" @click="onTopicUnhide_renderTemplate(10,'+state.hidePasswordIndex+');">提交</div>';
                      
                        nodeHtml += 	'</div>';
                        nodeHtml += '</div>';
                        childNode.innerHTML = nodeHtml;
                        
                        state.hidePasswordIndex++;
                    }
                    else if(childNode.getAttribute("hide-type") == "20"){
                        var nodeHtml = "";
                        nodeHtml += '<div class="hide-box">';
                        nodeHtml += 	'<Icon name="lock-solid-2" size="52px" class="background-image"></Icon>';
                        nodeHtml += 	'<div class="background-prompt">此处内容已被隐藏，评论话题可见</div>';
                        nodeHtml += '</div>';
                        childNode.innerHTML = nodeHtml;
                        state.isReplyTopicVisible = true;
                    }else if(childNode.getAttribute("hide-type") == "30"){
                        var nodeHtml = "";
                        nodeHtml += '<div class="hide-box">';
                        nodeHtml += 	'<Icon name="lock-solid-2" size="52px" class="background-image"></Icon>';
                        nodeHtml += 	'<div class="background-prompt">此处内容已被隐藏，等级达到‘'+escapeHtml(childNode.getAttribute("description"))+'’可见</div>';
                        nodeHtml += '</div>';
                        childNode.innerHTML = nodeHtml;
                    }else if(childNode.getAttribute("hide-type") == "40"){
                        var nodeHtml = "";
                        nodeHtml += '<div class="hide-box">';
                        nodeHtml += 	'<Icon name="lock-solid-2" size="52px" class="background-image"></Icon>';
                        nodeHtml += 	'<div class="background-prompt">此处内容已被隐藏，支付‘'+childNode.getAttribute("input-value")+'’积分可见</div>';
                        nodeHtml += 	'<div class="submit-box" @click="onTopicUnhide_renderTemplate(40);">立即购买</div>';
                        nodeHtml += '</div>';
                        childNode.innerHTML = nodeHtml;
                    }else if(childNode.getAttribute("hide-type") == "50"){
                        var nodeHtml = "";
                        nodeHtml += '<div class="hide-box">';
                        nodeHtml += 	'<Icon name="lock-solid-2" size="52px" class="background-image"></Icon>';
                        nodeHtml += 	'<div class="background-prompt">此处内容已被隐藏，支付 ￥<span class="highlight">'+childNode.getAttribute("input-value")+'</span> 元可见</div>';
                        nodeHtml += 	'<div class="submit-box" @click="onTopicUnhide_renderTemplate(50);">立即购买</div>';
                        nodeHtml += '</div>';
                        childNode.innerHTML = nodeHtml;
                    }
                }

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


                
                //处理视频标签
                if(childNode.nodeName.toLowerCase() == "player" ){
                    
                    let id = "player_"+random+"_"+i;
                    childNode.setAttribute("id",id);//设置Id
                    state.playerIdList.push(id);	
                }

                //处理下载
                if(childNode.nodeName.toLowerCase() == "a" ){
                    let href = childNode.getAttribute("href")
                    let title = childNode.getAttribute("title")
                    let linkType = childNode.getAttribute("linkType")
                    let startUrl = store.state.apiUrl+"fileDowload?jump=";
                    if(linkType == "download" && href != ""){
                        let downloadHtml = "";
                        if(href.toLowerCase().startsWith(startUrl.toLowerCase())){
                            downloadHtml ='<span class="download" @click="onDownload_renderTemplate(`'+href+'`);"><Icon name="download-2-line" size="20px" class="link-icon"></Icon>'+escapeHtml(title)+'</span>';
                        }else{
                            downloadHtml ='<a class="download" href="'+href+'"><Icon name="download-2-line" size="20px" class="link-icon"></Icon>'+escapeHtml(title)+'</a>';
                        }
                        let downloadDom = document.createElement('div');
                        downloadDom.innerHTML=downloadHtml;

                        childNode.replaceWith(downloadDom.firstElementChild);
                    }
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
    const addFavorite = (topicId:string) => {
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
        formData.append('topicId', topicId);

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
                    queryAlreadyCollected(topicId);
                    queryFavoriteCount(topicId);

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
    //用户是否已经收藏话题
    const queryAlreadyCollected = (topicId:string) => {
        proxy?.$axios({
            url: '/queryAlreadyCollected',
            method: 'get',
            params:  { 
                topicId: topicId,
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
    //查询话题用户收藏总数
    const queryFavoriteCount = (topicId:string) => {
        proxy?.$axios({
            url: '/queryFavoriteCount',
            method: 'get',
            params:  { 
                topicId: topicId,
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


    //添加点赞
    const addLike = (topicId:string) => {
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            ElMessage({
                showClose: true,
                message: '请先登录再点赞',
                type: 'info',
            })
            return;
        }
        if(state.alreadyLiked){
            return;
        }

        let formData = new FormData();
        formData.append('topicId', topicId);

        proxy?.$axios({
            url: '/user/control/like/add',
            method: 'post',
            data: formData
        })
        .then((response: AxiosResponse) => {
            if(response){

                const result: any = response.data;
            
                if(JSON.parse(result.success)){
                    ElMessage({
                        showClose: true,
                        message: '给话题点赞成功',
                        type: 'success',
                    })
                    queryAlreadyLiked(topicId);
                    queryLikeCount(topicId);

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
    //用户是否已经点赞话题
    const queryAlreadyLiked = (topicId:string) => {
        proxy?.$axios({
            url: '/queryAlreadyLiked',
            method: 'get',
            params:  { 
                topicId: topicId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                if(JSON.parse(data)){
                    state.alreadyLiked = true;
                }
            }
            
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    //查询话题用户点赞总数
    const queryLikeCount = (topicId:string) => {
        proxy?.$axios({
            url: '/queryLikeCount',
            method: 'get',
            params:  { 
                topicId: topicId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                let count = JSON.parse(data);
                state.likeCount = count;
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    
    //查询添加评论页
    const queryAddComment = (topicId:string) => {
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
       
        proxy?.$axios({
            url: '/queryAddComment',
            method: 'get',
            params:  {},
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                state.allowComment = data.allowComment;

                

                nextTick(()=>{
                    if(state.topic?.allow && data.allowComment){
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
                            state.availableTag = availableTagObject;//评论编辑器允许使用标签
                        }
                        
                        state.fileSystem = data.fileSystem;//文件存储系统
                        state.supportEditor = data.supportEditor;//支持编辑器 10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                        
                        if(state.addCommentEditorPlugin != null && state.addCommentEditorPlugin.length ==0){
                            //添加插件
                            state.addCommentEditorPlugin.push(...markdownPlugins);
                            state.addCommentEditorPlugin.push(emoji());
                            state.addCommentEditorPlugin.push(config(false));
                            
                            if(state.supportEditor == 30 || state.supportEditor == 40){//10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                                state.addCommentEditorPlugin.push(
                                    toggleEditor((editorId: string)=>{handleAddCommentToggleRichtextEditor(editorId)})
                                );
                            }
                            state.addCommentEditorPlugin.push(
                                help(state.availableTag,[])
                            );
                            if(state.availableTag?.indexOf('image') != -1){
                                state.addCommentEditorPlugin.push(
                                    imageUpload("user/control/comment/uploadImage?topicId="+state.topicId,'file',state.fileSystem)
                                );
                                state.addCommentEditorPlugin.push(
                                    pasteImageUpload("user/control/comment/uploadImage?topicId="+state.topicId,'file',state.fileSystem)
                                );
                            }    
                            
                        }
                              
                      
                        
                        if(data.supportEditor == 20 || data.supportEditor == 40){
                            state.isAddCommentMarkdown = true;
                        }

                        if (data.captchaKey != undefined && data.captchaKey != '') {
                            
                            state.showCaptcha.set("addComment-"+topicId,true)
                            state.captchaKey.set("addComment-"+topicId,data.captchaKey)
                            Object.assign(state.captchaValue, {['addComment-'+topicId] : ''});
                            replaceCaptcha("addComment-"+topicId);//刷新验证码
                        }
                       
                        if (Object.keys(state.addCommentEditorCreateParameObject).length === 0) {//等于空
                            let uploadPath = "user/control/comment/uploadImage?topicId="+topicId;
                        
                           
                            if(!state.isAddCommentMarkdown){
                                //创建富文本编辑器
                                state.addCommentEditor = createEditor(formAddCommentContentRef.value, state.availableTag, uploadPath, null,state.fileSystem,(editorId: string)=>{
                                    handleAddCommentToggleMarkdownEditor(editorId);
                                });
                            }
                            state.addCommentEditorCreateParameObject = {
                                ref:formAddCommentContentRef.value,
                                availableTag:state.availableTag,
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


    //添加评论 -- 提交数据
    const onAddCommentFormSubmit = () => {
        let _key =  "addComment-"+state.topicId;
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
                error.comment.delete(_key);

                let formData = new FormData();
                formData.append('topicId', state.topicId);

                
                if(state.isAddCommentMarkdown){
                    formData.append('isMarkdown', state.isAddCommentMarkdown.toString());
                    formData.append('markdownContent', state.addCommentMarkdownContent);
                }else{
                    if(formAddCommentContentRef.value.value != null && formAddCommentContentRef.value.value !=''){
                        formData.append('content', formAddCommentContentRef.value.value);
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
                    url: '/user/control/comment/add',
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

                            state.addCommentMarkdownContent = "";



                            if (Object.keys(state.addCommentEditor).length != 0) {//不等于空
                                //清空字段
                                state.addCommentEditor.html("");
                                //自动展开内容
                                state.addCommentEditor.autoExpandContent();
                                //state.addCommentEditor.remove();
                                //state.addCommentEditorCreateParameObject = {};
                            }

                           

                            //重置表单
                            //formAddCommentRef.value?.resetFields();
                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }

                            let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
                
                            queryCommentList(state.topicId,'','',page);
                            if(state.isReplyTopicVisible){
                                queryTopic(state.topicId,()=>{});
                            }

                        }else{
                            //处理错误信息
                            for (const [key, value] of Object.entries(result.error) as [string, string][]){
                                if(key == 'content'){
                                    error.content.set(_key,value);
                                }else if(key == 'comment'){
                                    error.comment.set(_key,value);
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

    //修改评论表单
    const editCommentUI = (comment: Comment) => {
        let _key =  "editComment-"+comment.id;
        if(state.editCommentFormView.get(comment.id) == true){//如果已打开
            return;
        }
        
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        proxy?.$axios({
            url: '/user/queryEditComment',
            method: 'get',
            params:  {
                commentId: comment.id
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            let data =  response.data;

            let _comment = data.comment;

            if(data.allowComment && _comment != undefined){
                Object.assign(state.editCommentMarkdownContent, {[_comment.id] : _comment.markdownContent});
                
                state.editCommentFormView.set(comment.id,true);

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


                    if(state.editCommentEditorPlugin != null && state.editCommentEditorPlugin.length ==0){
                        //添加插件
                        state.editCommentEditorPlugin.push(...markdownPlugins);
                        state.editCommentEditorPlugin.push(emoji());
                        state.editCommentEditorPlugin.push(config(true));
                        state.editCommentEditorPlugin.push(
                            help(availableTag,[])
                        );
                        if(availableTag?.indexOf('image') != -1){
                            state.editCommentEditorPlugin.push(
                                imageUpload("user/control/comment/uploadImage?topicId="+state.topicId,'file',state.fileSystem)
                            );
                            state.editCommentEditorPlugin.push(
                                pasteImageUpload("user/control/comment/uploadImage?topicId="+state.topicId,'file',state.fileSystem)
                            );
                        }   
                    }

                    if (data.captchaKey != undefined && data.captchaKey != '') {
                        
                        state.showCaptcha.set(_key,true)
                        state.captchaKey.set(_key,data.captchaKey)
                        Object.assign(state.captchaValue, {[_key] : ''});
                        replaceCaptcha(_key);//刷新验证码
                    }

                    for(let i = 0; i<state.editCommentElementNodes.length; i++){
						let editCommentElement = state.editCommentElementNodes[i];
                        editCommentElement.value = _comment.content;
                        let _commentId = editCommentElement.getAttribute("commentId");

                        if(_commentId == comment.id){
                            let uploadPath = "user/control/comment/uploadImage?topicId="+state.topicId;
                
                            if(_comment.isMarkdown != null && _comment.isMarkdown == true){
                                state.isEditCommentMarkdownMap.set(comment.id,true);
                            }else{
                                state.isEditCommentMarkdownMap.set(comment.id,false);
                            }
                            if(!state.isEditCommentMarkdownMap.get(comment.id)){
                                //创建富文本编辑器
                                let editor = createEditor(editCommentElement, availableTag, uploadPath, null,state.fileSystem,(editorId: string)=>{});
                                state.editCommentEditorMap.set(comment.id,editor);
                            }
                            

                            state.editCommentEditorCreateParameMap.set(comment.id, {
                                    ref:editCommentElement,
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
                if(!data.allowComment){
                    ElMessage({
                        showClose: true,
                        message: '不允许修改评论',
                        type: 'info',
                    })
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    
    //修改评论 -- 提交数据
    const onEditCommentFormSubmit = (commentId:string) => {
        let _key =  "editComment-"+commentId;
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
                error.comment.delete(_key);

                let formData = new FormData();
                formData.append('commentId', commentId);



                if(state.isEditCommentMarkdownMap.get(commentId)!= undefined && state.isEditCommentMarkdownMap.get(commentId) == true){
                    if(state.editCommentMarkdownContent[commentId] != undefined){
                        formData.append('markdownContent', state.editCommentMarkdownContent[commentId]);
                    }
                }else{
                    for(let i = 0; i<state.editCommentElementNodes.length; i++){
                        let editCommentElement = state.editCommentElementNodes[i];
                        let _commentId = editCommentElement.getAttribute("commentId");
                        
                        if(_commentId == commentId){
                            formData.append('content', editCommentElement.value);
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
                    url: '/user/control/comment/edit',
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
                           

                            let editCommentEditor = state.editCommentEditorMap.get(commentId);
                            if(editCommentEditor != null){
                                editCommentEditor.remove();
                                state.editCommentEditorMap.delete(commentId);
                                state.editCommentEditorCreateParameMap.delete(commentId);
                            }
                            



                            if(state.editCommentMarkdownContent[commentId] != undefined){
                               state.editCommentMarkdownContent[commentId] = ""
                            }
                           
                            
                            nextTick(()=>{//需要延迟才能让state.editCommentMarkdownContent[commentId]的设置生效
                                state.editCommentFormView.set(commentId,false);
                            })




                            //重置表单
                            //formAddCommentRef.value?.resetFields();
                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }

                            let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
                
                            queryCommentList(state.topicId,'','',page);

                        }else{
                            //处理错误信息
                            for (const [key, value] of Object.entries(result.error) as [string, string][]){
                                if(key == 'content'){
                                    error.content.set(_key,value);
                                }else if(key == 'comment'){
                                    error.comment.set(_key,value);
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
    //取消修改评论
    const onCancelEditComment = (commentId:string) => {
        let editCommentEditor = state.editCommentEditorMap.get(commentId);
        if(editCommentEditor != null){
            editCommentEditor.remove();
            state.editCommentEditorMap.delete(commentId);
            state.editCommentEditorCreateParameMap.delete(commentId);
        }
        state.editCommentFormView.set(commentId,false);
    }

    //引用评论表单
    const quoteCommentUI = (comment: Comment) => {
        let _key =  "addQuoteComment-"+comment.id;
        if(state.quoteFormView.get(comment.id) == true){//如果已打开
            return;
        }
        
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态

        proxy?.$axios({
            url: '/user/queryQuoteComment',
            method: 'get',
            params:  {
                commentId: comment.id
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                let quoteContent = data.quoteContent;


                if(data.allowComment){
                    state.quoteFormView.set(comment.id,true);

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
                        state.supportEditor = data.supportEditor;//支持编辑器 10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                        
                        if(state.quoteCommentEditorPlugin != null && state.quoteCommentEditorPlugin.length ==0){
                            //添加插件
                            state.quoteCommentEditorPlugin.push(...markdownPlugins);
                            state.quoteCommentEditorPlugin.push(emoji());
                            state.quoteCommentEditorPlugin.push(config(true));  
                            if(state.supportEditor == 30 || state.supportEditor == 40){//10.仅富文本编辑器 20.仅Markdown编辑器  30.富文本编辑器优先 40.Markdown编辑器优先
                                state.quoteCommentEditorPlugin.push(
                                    toggleEditor((editorId: string)=>{handleQuoteCommentToggleRichtextEditor(editorId)})
                                );
                            }
                            state.quoteCommentEditorPlugin.push(
                                help(availableTag,[])
                            );
                            if(availableTag?.indexOf('image') != -1){
                                state.quoteCommentEditorPlugin.push(
                                    imageUpload("user/control/comment/uploadImage?topicId="+state.topicId,'file',state.fileSystem)
                                );
                                state.quoteCommentEditorPlugin.push(
                                    pasteImageUpload("user/control/comment/uploadImage?topicId="+state.topicId,'file',state.fileSystem)
                                );
                            }  
                        }
                              
                        

                        if (data.captchaKey != undefined && data.captchaKey != '') {
                            
                            state.showCaptcha.set(_key,true)
                            state.captchaKey.set(_key,data.captchaKey)
                            Object.assign(state.captchaValue, {[_key] : ''});
                            replaceCaptcha(_key);//刷新验证码
                        }

                        for(let i = 0; i<state.quoteElementNodes.length; i++){
                            let quoteElement = state.quoteElementNodes[i];
                            
                            let _commentId = quoteElement.getAttribute("commentId");
                            quoteElement.value = "";
                            if(_commentId == comment.id){
                                
                                if(data.supportEditor == 20 || data.supportEditor == 40){
                                    state.isQuoteCommentMarkdownMap.set(comment.id,true);
                                }else{
                                    state.isQuoteCommentMarkdownMap.set(comment.id,false);
                                }

                                let uploadPath = "user/control/comment/uploadImage?topicId="+state.topicId;
                                if(!state.isQuoteCommentMarkdownMap.get(comment.id)){
                                    //创建富文本编辑器
                                    let editor = createEditor(quoteElement, availableTag, uploadPath, null,state.fileSystem,(editorId: string)=>{
                                        handleQuoteCommentToggleMarkdownEditor(editorId);
                                    });
                                    state.quoteEditorMap.set(comment.id,editor);
                                }
                               

                                state.quoteEditorCreateParameMap.set(comment.id, {
                                        ref:quoteElement,
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
                    ElMessage({
                        showClose: true,
                        message: '不允许引用评论',
                        type: 'info',
                    })
                }
            }
            
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    
    //引用评论 -- 提交数据
    const onQuoteCommentFormSubmit = (commentId:string) => {
        let _key =  "addQuoteComment-"+commentId;
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
                error.comment.delete(_key);

                let formData = new FormData();
                formData.append('commentId', commentId);

                


                if(state.isQuoteCommentMarkdownMap.get(commentId)!= undefined && state.isQuoteCommentMarkdownMap.get(commentId) == true){
                    formData.append('isMarkdown', state.isQuoteCommentMarkdownMap.get(commentId).toString());
                    if(state.quoteCommentMarkdownContent[commentId] != undefined){
                        formData.append('markdownContent', state.quoteCommentMarkdownContent[commentId]);
                    }
                }else{
                    for(let i = 0; i<state.quoteElementNodes.length; i++){
                        let quoteElement = state.quoteElementNodes[i];
                        let _commentId = quoteElement.getAttribute("commentId");
                        
                        if(_commentId == commentId){
                            formData.append('content', quoteElement.value);
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
                    url: '/user/control/comment/addQuote',
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
                           

                            let quoteEditor = state.quoteEditorMap.get(commentId);
                            if(quoteEditor != null){
                                quoteEditor.remove();
                                state.quoteEditorMap.delete(commentId);
                                state.quoteEditorCreateParameMap.delete(commentId);
                            }

                            if(state.quoteCommentMarkdownContent[commentId] != undefined){
                               state.quoteCommentMarkdownContent[commentId] = ""
                            }
                           
                            
                            nextTick(()=>{//需要延迟才能让state.quoteCommentMarkdownContent[commentId]的设置生效
                                state.quoteFormView.set(commentId,false);
                            })

                            //重置表单
                            //formAddCommentRef.value?.resetFields();
                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }

                            let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
                
                            queryCommentList(state.topicId,'','',page);

                        }else{
                            //处理错误信息
                            for (const [key, value] of Object.entries(result.error) as [string, string][]){
                                if(key == 'content'){
                                    error.content.set(_key,value);
                                }else if(key == 'comment'){
                                    error.comment.set(_key,value);
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
    //取消引用评论
    const onCancelQuoteComment = (commentId:string) => {
        let quoteEditor = state.quoteEditorMap.get(commentId);
        if(quoteEditor != null){
            quoteEditor.remove();
            state.quoteEditorMap.delete(commentId);
            state.quoteEditorCreateParameMap.delete(commentId);
        }
        state.quoteFormView.set(commentId,false);
    }
    //删除评论
    const onDeleteComment = (commentId:string) => {
        ElMessageBox.confirm('确定删除评论?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
            formData.append('commentId', commentId);

        

            proxy?.$axios({
                url: '/user/control/comment/delete',
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
        
                        
                        let editCommentEditor = state.editCommentEditorMap.get(commentId);
                        if(editCommentEditor != null){
                            editCommentEditor.remove();
                            state.editCommentEditorMap.delete(commentId);
                            state.editCommentEditorCreateParameMap.delete(commentId);
                        }
                        state.editCommentFormView.set(commentId,false);

                        let quoteEditor = state.quoteEditorMap.get(commentId);
                        if(quoteEditor != null){
                            quoteEditor.remove();
                            state.quoteEditorMap.delete(commentId);
                            state.quoteEditorCreateParameMap.delete(commentId);
                        }
                        state.quoteFormView.set(commentId,false);

                        let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
            
                        queryCommentList(state.topicId,'','',page);

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
    const addReplyFriendUI = ( commentId:string, replyId:string) => {
        let _key =  "addReplyFriend-"+replyId;
        if(state.addReplyFriendFormView.get(replyId) == true){//如果已打开
			return;
		}
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态
     
        proxy?.$axios({
            url: '/user/queryAddReply',
            method: 'get',
            params:  {
                commentId: commentId
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
     const onAddReplyFriend = (commentId:string,replyId:string) => {
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
                formData.append('commentId',  commentId); 

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
                    url: '/user/control/comment/addReply',
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
                
                            queryCommentList(state.topicId,'','',page);

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
    const addReplyUI = (commentId:string) => {
        let _key =  "addReply-"+commentId;
        if(state.addReplyFormView.get(commentId) == true){//如果已打开
			return;
		}
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态


        proxy?.$axios({
            url: '/user/queryAddReply',
            method: 'get',
            params:  {
                commentId: commentId
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                let data =  response.data;
                if(data.allowReply){
                    state.addReplyFormView.set(commentId,true);

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
    const onAddReply = (commentId:string) => {
        let _key =  "addReply-"+commentId;
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
                formData.append('commentId', commentId);

                if(state.commentList != null && state.commentList.length > 0){
                    for (let i = 0; i <state.commentList.length; i++) {
                        let comment = state.commentList[i];
                        if(comment.id == commentId){
                            if(state.addReplyContentField[i]){
                                formData.append('content',  state.addReplyContentField[i]);
                            }
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
                    url: '/user/control/comment/addReply',
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
                           

                            
                            if(state.commentList != null && state.commentList.length > 0){
                                for (let i = 0; i <state.commentList.length; i++) {
                                    let comment = state.commentList[i];
                                    if(comment.id == commentId){
                                        state.addReplyContentField[i] = "";//清空
                                        break; 
                                    }
                                    
                                }
                            }
                            state.addReplyFormView.set(commentId,false);

                            //重置表单
                            //formAddCommentRef.value?.resetFields();
                            if(state.showCaptcha.get(_key) == true){
                                Object.assign(state.captchaValue, {[_key] : ''});
                            }

                            let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
                
                            queryCommentList(state.topicId,'','',page);

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
    const onCancelAddReply = (commentId:string) => {
        state.addReplyFormView.set(commentId,false);
    }



    //修改回复表单
    const editReplyUI = (reply:Reply) => {
        let _key =  "editReply-"+reply.id;
        if(state.editReplyFormView.get(reply.id) == true){//如果已打开
			return;
		}
        if(store.state.systemUser == null || Object.keys(store.state.systemUser).length==0){
            return;
        }
        state.allowSubmit.set(_key,true);//提交按钮disabled状态


        proxy?.$axios({
            url: '/user/queryEditReply',
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

                if(state.commentList != null && state.commentList.length > 0){
                    for (let i = 0; i <state.commentList.length; i++) {
                        let comment = state.commentList[i];
                        
                        if(comment.replyList != null && comment.replyList.length >0){
                            for (let j = 0; j <comment.replyList.length; j++) {
                                let reply = comment.replyList[j];
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
                    url: '/user/control/comment/editReply',
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
                
                            queryCommentList(state.topicId,'','',page);

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
                url: '/user/control/comment/deleteReply',
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
            
                        queryCommentList(state.topicId,'','',page);

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

    //查询发红包内容
    const queryGiveRedEnvelopeContent = (giveRedEnvelopeId:string) => {
    		state.receiveRedEnvelopeList.length = 0;
        proxy?.$axios({
            url: '/queryGiveRedEnvelopeContent',
            method: 'get',
            params:  {
                giveRedEnvelopeId:giveRedEnvelopeId
            },
        })
        .then((response: AxiosResponse) => {
            return response?.data;
        })
        .then((data: GiveRedEnvelope) => {

            state.giveRedEnvelope = {} as GiveRedEnvelope;

            if(data){
                state.giveRedEnvelope = data;
                if(state.giveRedEnvelope.nickname != null && state.giveRedEnvelope.nickname !=''){
                    state.giveRedEnvelope.avatar = letterAvatar(state.giveRedEnvelope.nickname, 48);
                }else{
                    state.giveRedEnvelope.avatar = letterAvatar(state.giveRedEnvelope.account, 48);
                }
            }
            
        }).catch((error: any) =>{
            console.log(error);
        });
    }
    //查询领取红包用户列表
    const queryReceiveRedEnvelopeUser = (giveRedEnvelopeId:string, page:number) => {
        proxy?.$axios({
            url: '/queryReceiveRedEnvelopeUser',
            method: 'get',
            params:  {
                giveRedEnvelopeId:giveRedEnvelopeId,
                page : page
            },
        })
        .then((response: AxiosResponse) => {
            return response?.data;
        })
        .then((data: PageView<ReceiveRedEnvelope>) => {
        		
            if(data && data.records != null && data.records.length >0){
                let receiveRedEnvelopeList = data.records;
                if (receiveRedEnvelopeList != null && receiveRedEnvelopeList.length > 0) {
                    for(var i=0;i<receiveRedEnvelopeList.length; i++){
                        let receiveRedEnvelope = receiveRedEnvelopeList[i] as ReceiveRedEnvelope;
                        if(receiveRedEnvelope.receiveNickname != null && receiveRedEnvelope.receiveNickname !=''){
                            receiveRedEnvelope.receiveAvatar = letterAvatar(receiveRedEnvelope.receiveNickname, 32);
                        }else{
                            receiveRedEnvelope.receiveAvatar = letterAvatar(receiveRedEnvelope.receiveAccount, 32);
                        }
                        state.receiveRedEnvelopeList.push(receiveRedEnvelope);
                    }
                }

                //显示更多
                if(parseInt(data.totalrecord) != state.receiveRedEnvelopeList.length){
                    
                    state.receiveRedEnvelope_more = true;
                }else{
                    state.receiveRedEnvelope_more = false;
                }
                state.receiveRedEnvelopeCurrentPage = data.currentpage;
            }

        }).catch((error: any) =>{
            console.log(error);
        });
    }


    //抢红包
    const grabRedEnvelope = (giveRedEnvelopeId:string) => {
        let formData = new FormData();
        formData.append('giveRedEnvelopeId', giveRedEnvelopeId);
        
        proxy?.$axios({
            url: '/user/control/redEnvelope/addReceiveRedEnvelope',
            method: 'post',
            data: formData
        })
        .then((response: AxiosResponse) => {
            if(response){

                const result: any = response.data;
            
                if(JSON.parse(result.success)){
                    
                    let receiveRedEnvelopeAmount = result.receiveRedEnvelopeAmount
                    ElMessage({
                        showClose: true,
                        message: "抢到 "+receiveRedEnvelopeAmount+" 元红包",
                        type: 'success',
                    })

                    nextTick(()=>{
                        state.receiveRedEnvelopeList.length = 0;//清空数组
                        queryGiveRedEnvelopeContent(giveRedEnvelopeId);
                        queryReceiveRedEnvelopeUser(giveRedEnvelopeId,1);

                    })
                }else{
                    //处理错误信息
                    processErrorInfo(result.error as Map<string,string> , reactive({}),()=>{});

                    

                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //查询相似话题
    const queryLikeTopic = (topicId:string) => {
        proxy?.$axios({
            url: '/queryLikeTopic',
            method: 'get',
            params:  {
                topicId:topicId
            },
        })
        .then((response: AxiosResponse) => {
            return response?.data;
        })
        .then((data: Array<Topic>) => {
            state.likeTopicList.length =0;

            if(data){
                state.likeTopicList = data;
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }
    
    //点击回复层级
    const clickReplyLevel = (commentId:string,replyId:string) => {
       
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
           showReplyLevel(commentId,replyId);
       }
       
   }

   //展示回复层级
   const showReplyLevel = (commentId:string,replyId:string) => {

       let dotArray = new Array();
       let replyList = [] as Array<Reply>;
       if(state.commentList != null && state.commentList.length > 0){
           A:for (let i = 0; i <state.commentList.length; i++) {
               let comment = state.commentList[i];
               
                if(comment.id == commentId){
                   //回复
                   if(comment.replyList != null && comment.replyList.length >0){
                       replyList = comment.replyList;
                       for (let j = 0; j <comment.replyList.length; j++) {
                           let reply = comment.replyList[j];
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
        if (Object.keys(state.addCommentEditor).length != 0) {//不等于空
            state.addCommentEditor.html("");//清空字段
			state.addCommentEditor.remove();
            state.addCommentEditor = {};
		}
        state.addCommentEditorCreateParameObject = {};
		
		state.quoteEditorMap.forEach(function(value,key){
            value.html("");//清空字段
			value.remove();
	    });
        state.quoteEditorMap.clear();
		
		state.editCommentEditorMap.forEach(function(value,key){
            value.html("");//清空字段
			value.remove();
	    });
		state.editCommentEditorMap.clear();

        state.addCommentMarkdownContent='';

        state.isQuoteCommentMarkdownMap.clear();
        state.quoteCommentMarkdownContent = {} as any;//引用评论markdown编辑内容 key:评论Id value:评论内容


        state.isEditCommentMarkdownMap.clear();
        state.editCommentMarkdownContent = {} as any;//修改评论markdown编辑内容 key:评论Id value:评论内容

        state.addCommentEditorPlugin.length = 0;//插件
        state.quoteCommentEditorPlugin.length = 0;//插件
        state.editCommentEditorPlugin.length = 0;//插件

        state.editCommentFormView.clear() //修改评论表单
        state.editCommentEditorCreateParameMap.clear()//修改评论编辑器的创建参数

        state.quoteFormView.clear() //评论引用表单
        state.quoteEditorCreateParameMap.clear()//引用评论编辑器的创建参数
    }
  

  
    //导航守卫
    onBeforeRouteUpdate((to, from, next) => {
        if(to.name == 'thread'){
            let page:number | undefined = undefined;
            let topicId:string = '';
            let commentId:string = '';
            let replyId:string = '';
            if(to.query.page != undefined){
                page = parseInt(to.query.page as string);
            }
            if(to.query.topicId != undefined){
                topicId = to.query.topicId as string
            }
            if(to.query.commentId != undefined){
                commentId = to.query.commentId as string
            }
            if(to.query.replyId != undefined){
                replyId = to.query.replyId as string
            }
            //清除编辑器
            clearEditor();
            queryTopic(topicId,()=>{
                state.topicId = topicId;
                queryAddComment(topicId);
                queryFollowerCount(state.topic.userName);//查询粉丝总数
                queryFollowing(state.topic.userName);//查询是否已关注该用户
                queryAnswerCount(state.topic.userName);
                queryFollowCount(state.topic.userName);
                queryGiveRedEnvelopeContent(state.topic.giveRedEnvelopeId);
                queryReceiveRedEnvelopeUser(state.topic.giveRedEnvelopeId, 1);

               
            });
            queryAlreadyCollected(topicId);
            queryFavoriteCount(topicId);
            queryAlreadyLiked(topicId);
            queryLikeCount(topicId);
            queryCommentList(topicId,commentId,replyId,page);
            queryLikeTopic(topicId);
            
        }
        
        next();
    });

    //清空
    onBeforeUpdate(() => {
        topicRefs.value = {}
    })

    onMounted(() => {
        let page:number|undefined = router.currentRoute.value.query.page != undefined ? parseInt(router.currentRoute.value.query.page as string) :undefined;
        let topicId:string = router.currentRoute.value.query.topicId != undefined ?router.currentRoute.value.query.topicId as string :'';
        
        let commentId:string = router.currentRoute.value.query.commentId != undefined ?router.currentRoute.value.query.commentId as string :'';
        let replyId:string = router.currentRoute.value.query.replyId != undefined ?router.currentRoute.value.query.replyId as string :'';
        
        state.topicId = topicId;

        queryTopic(topicId,()=>{
            queryAddComment(topicId);
            
            queryFollowerCount(state.topic.userName);//查询粉丝总数
            queryFollowing(state.topic.userName);//查询是否已关注该用户
            queryAnswerCount(state.topic.userName);
            queryFollowCount(state.topic.userName);
            queryGiveRedEnvelopeContent(state.topic.giveRedEnvelopeId);
            queryReceiveRedEnvelopeUser(state.topic.giveRedEnvelopeId, 1)
        });
        queryAlreadyCollected(topicId);
        queryFavoriteCount(topicId);
        queryAlreadyLiked(topicId);
        queryLikeCount(topicId);
        queryCommentList(topicId,commentId,replyId,page);
        queryLikeTopic(topicId);
    }) 

    //卸载组件实例后调用
    onUnmounted (()=>{
        //清除播放器
        clearVideoPlayer();


    })

</script>

<style scoped lang="scss">
:deep(.dropdown-menu-icon){
    margin-right: 4px;
    position: relative;
    top: 3px;
}
.topicContentModule{
    display: flex;
    .left {
        flex: 1 0 auto;
        width: 900px;
        height: auto;
        .topic-wrap{
            background: #fff;
            box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
            position: relative;
            .topicTag{
                padding-top:15px;
                margin-left:15px;
                .tag{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 14px;
                    padding: 6px 8px 6px 8px;
                    margin-right: 5px;
                    border-radius: 3px;
                    color: $color-black-80;
                    background-color: $color-black-20;
                    position:relative;
                    &:hover {
                        background-color: $color-black-30;
                        color: $color-black-80;
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
                .editTopic{
                    float: right;
                    .icon{
                        margin-right: 3px;
                        position: relative;
                        top: 3px;
                    }
                    a{
                        font-size: 15px;
                        margin-left: 10px;
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

            .topicBox{
                height: auto;
                padding:15px 15px 25px 15px;
                .title{
                    color:$color-black-100;
                    font-size:24px;
                    border:none;
                    line-height:34px; 
                    margin:9px 0 18px 0;
                    .essence{
                        display: inline-block;
                        vertical-align: middle;
                        padding: 3px 4px;
                        margin-right:6px;
                        font-size: 15px;
                        line-height: 15px;
                        -webkit-border-radius: 2px;
                        -moz-border-radius: 2px;
                        border-radius: 2px;
                        color: #fff;
                        background-color: #F76560;
                        position: relative;
                        top: -1px;
                    }
                    .top{
                        display: inline-block;
                        vertical-align: middle;
                        padding: 3px 4px;
                        margin-right:1px;
                        font-size: 15px;
                        line-height: 15px;
                        -webkit-border-radius: 2px;
                        -moz-border-radius: 2px;
                        border-radius: 2px;
                        color: #fff;
                        background-color: #57A9FB;
                        position: relative;
                        top: -1px;
                    }
                }
                .topicInfo{
                    color: $color-black-50;font-size: 14px;
                    .postTime{
                        float: left;
                    }
                    .viewTotal-icon{
                        float: left;margin-left: 20px;margin-top: 2px;
                    }
                    .viewTotal{
                        float: left;margin-left: 3px;
                    }
                    .comment-icon{
                        float: left;margin-left: 20px;margin-top: 2px;
                    }
                    .comment{
                        float: left;margin-left: 3px;
                    }
                }
                :deep(.topicMarkdownContent){
                    border-top:1px solid $color-black-20;
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
                        font-size:16px;
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
                   // ul li{
                     //   list-style-type:disc;
                  //  }
                    .task-list-item {
                        list-style-type:none;
                    }
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
                    .download{
                        color: #1890ff;
                        margin: 0 5px 0 5px;
                        cursor: pointer;
                        font-size:16px;
                        .link-icon {
                            position: relative;
                            top: 4px;
                            margin-right: 2px;
                            color:#1890ff;
                        }
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
                    player{
                        width: 100%;
                        height: 576px;
                        display: block;
                        margin-top: 10px;
                    }
                    .dplayer-process {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        z-index: 99;
                        .box{
                            position: relative;
                            width: 100%;
                            height: 100%;
                            .prompt{
                                width: 250px;
                                height: 80px;
                                position: absolute;
                                left: 0;
                                top: 0;
                                right: 0;
                                bottom: 0;
                                margin: auto;
                                padding :0px 30px;
                                border-radius :3px;
                                color: #fff;
                                line-height: 80px;
                                font-size: 20px;
                                background-color:rgb(0,0,0);
                                opacity:0.7;
                                filter:alpha(opacity=70);
                                text-align: center;
                            }
                        }
                    }
                    hide{
                        display:block;
                        background: $color-black-10;
                        min-height:100px;
                        margin-left: 10px;
                        margin-right: 10px;
                        margin-top: 17px;
                        margin-bottom: 15px;
                        border: 3px dashed $color-black-30;
                        border-radius: 5px;
                        .hide-box{
                            margin: 20px;position: relative;text-align: center;
                        }
                        .background-image{
                            margin: auto;
                            margin-top:15px;
                            color: $color-black-40;
                        }
                        .background-prompt{
                            margin-top: 5px; color: $color-black-50;font-size: 16px;
                        }
                        .highlight{
                            font-weight:bold;
                        }
                        .input-box{
                            pointer-events: none;
                            margin: auto; 
                            margin-top: 10px;
                            margin-bottom:25px; 
                            border:$color-black-70 solid 2px;
                            width:226px; 
                            height:26px; 
                           // overflow:hidden; 
                            border-radius: 2px;
                            position: relative;
                            &:hover{
                                border:$color-black-80 solid 2px;
                                .button{
                                    border:transparent solid 0px; 
                                    background:$color-black-80;
                                }
                            }
                            .text{ 
                                pointer-events:auto;
                                width:145px; 
                                height:26px; 
                                line-height:26px; 
                                border:0; 
                                float:left; 
                                font-size:14px; 
                                color:$color-black-80; 
                                text-indent: 6px; 
                                vertical-align:middle;
                                outline:none; 
                                background: $color-black-10;
                            }
                            .button{
                                position: absolute;
                                top: -1px;
                                right: -2px;
                                pointer-events:auto; 
                                display: inline-block;
                                white-space:nowrap;
                                width:80px;
                                height:28px; 
                                vertical-align: middle;
                                font-size: 15px;
                                line-height: 28px;
                                -webkit-border-radius: 0px 2px 2px 0px;
                                -moz-border-radius: 0px 2px 2px 0px;
                                border-radius: 0px 2px 2px 0px;
                                color:#fff;
                                background-color:$color-black-70;
                                cursor:pointer;
                                user-select:none;
                                &:hover{
                                    background:$color-black-80;
                                }
                            }
                        }
                        .submit-box{
                            margin-top: 10px;
                            margin-bottom:5px; 
                            display: inline-block;
                            white-space:nowrap;
                            width:80px;
                            height:30px; 
                            vertical-align: middle;
                            font-size: 15px;
                            line-height: 30px;
                            -webkit-border-radius: 2px;
                            -moz-border-radius: 2px;
                            border-radius: 2px;
                            color:#fff;
                            background-color:$color-black-70;
                            cursor:pointer;
                            user-select:none;
                            &:hover{
                                background:$color-black-80;
                            }
                        }
                        .input-box{
                            .text::-webkit-input-placeholder {
                                color: $color-black-70;
                            }
                            .text:-ms-input-placeholder {
                                color: $color-black-70;
                            }
                            .text:-moz-placeholder {
                                color: $color-black-70;
                            }
                            .text::-moz-placeholder {
                                color: $color-black-70;
                            }
                        }
                    }
                }

                :deep(.topicContent){
                    border-top:1px solid $color-black-20;
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
                    p{
                        font-size:16px;
                        word-wrap:break-word
                    }
                    img{
                        max-width:100%;height:auto;border:none;background:none;margin:0;padding:0; 
                        cursor: -webkit-zoom-in;
                        cursor: zoom-in;
                        vertical-align: sub;
                    }
                    .download{
                        color: #1890ff;
                        margin: 0 5px 0 5px;
                        cursor: pointer;
                        font-size:16px;
                        .link-icon {
                            position: relative;
                            top: 4px;
                            margin-right: 2px;
                            color:#1890ff;
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
                    iframe{
                        width:100%; height: 550px;padding:10px 0px; 
                    }
                    player{
                        width: 100%;
                        height: 576px;
                        display: block;
                        margin-top: 10px;
                    }
                    .dplayer-process {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        z-index: 99;
                        .box{
                            position: relative;
                            width: 100%;
                            height: 100%;
                            .prompt{
                                width: 250px;
                                height: 80px;
                                position: absolute;
                                left: 0;
                                top: 0;
                                right: 0;
                                bottom: 0;
                                margin: auto;
                                padding :0px 30px;
                                border-radius :3px;
                                color: #fff;
                                line-height: 80px;
                                font-size: 20px;
                                background-color:rgb(0,0,0);
                                opacity:0.7;
                                filter:alpha(opacity=70);
                                text-align: center;
                            }
                        }
                    }
                    hide{
                        display:block;
                        background: $color-black-10;
                        min-height:100px;
                        margin-left: 10px;
                        margin-right: 10px;
                        margin-top: 17px;
                        margin-bottom: 15px;
                        border: 3px dashed $color-black-30;
                        border-radius: 5px;
                        .hide-box{
                            margin: 20px;position: relative;text-align: center;
                        }
                        .background-image{
                            margin: auto;
                            margin-top:15px;
                            color: $color-black-40;
                        }
                        .background-prompt{
                            margin-top: 5px; color: $color-black-50;font-size: 16px;
                        }
                        .highlight{
                            font-weight:bold;
                        }
                        .input-box{
                            pointer-events: none;
                            margin: auto; 
                            margin-top: 10px;
                            margin-bottom:25px; 
                            border:$color-black-70 solid 2px;
                            width:226px; 
                            height:26px; 
                           // overflow:hidden; 
                            border-radius: 2px;
                            position: relative;
                            &:hover{
                                border:$color-black-80 solid 2px;
                                .button{
                                    border:transparent solid 0px; 
                                    background:$color-black-80;
                                }
                            }
                            .text{ 
                                pointer-events:auto;
                                width:145px; 
                                height:26px; 
                                line-height:26px; 
                                border:0; 
                                float:left; 
                                font-size:14px; 
                                color:$color-black-80; 
                                text-indent: 6px; 
                                vertical-align:middle;
                                outline:none; 
                                background: $color-black-10;
                            }
                            .button{
                                position: absolute;
                                top: -1px;
                                right: -2px;
                                pointer-events:auto; 
                                display: inline-block;
                                white-space:nowrap;
                                width:80px;
                                height:28px; 
                                vertical-align: middle;
                                font-size: 15px;
                                line-height: 28px;
                                -webkit-border-radius: 0px 2px 2px 0px;
                                -moz-border-radius: 0px 2px 2px 0px;
                                border-radius: 0px 2px 2px 0px;
                                color:#fff;
                                background-color:$color-black-70;
                                cursor:pointer;
                                user-select:none;
                                &:hover{
                                    background:$color-black-80;
                                }
                            }
                        }
                        .submit-box{
                            margin-top: 10px;
                            margin-bottom:5px; 
                            display: inline-block;
                            white-space:nowrap;
                            width:80px;
                            height:30px; 
                            vertical-align: middle;
                            font-size: 15px;
                            line-height: 30px;
                            -webkit-border-radius: 2px;
                            -moz-border-radius: 2px;
                            border-radius: 2px;
                            color:#fff;
                            background-color:$color-black-70;
                            cursor:pointer;
                            user-select:none;
                            &:hover{
                                background:$color-black-80;
                            }
                        }
                        .input-box{
                            .text::-webkit-input-placeholder {
                                color: $color-black-70;
                            }
                            .text:-ms-input-placeholder {
                                color: $color-black-70;
                            }
                            .text:-moz-placeholder {
                                color: $color-black-70;
                            }
                            .text::-moz-placeholder {
                                color: $color-black-70;
                            }
                        }
                    }
                    //自动换行
                    pre{
                        white-space:pre-wrap;
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

/* 评论 */
.commentModule{
	margin-top:10px;
	padding: 0px 10px 50px 10px;
	position: relative;
	padding-bottom:0;
	background: #fff;
	box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
    .commentList{
        list-style:none;
        font-size: 15px;
        .commentInfo{
            padding:15px 0 5px 77px;
            border-bottom:1px solid $color-black-20;
            .comment-author{
                position:relative;
                color:$color-black-60;
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
            }
            .commentTime{
                margin-top:3px;
                margin-bottom:5px;
                color:$color-black-50;
                font-size: 13px;
                a{
                    color:$color-black-50;
                }
            }
            :deep(.commentMarkdownContent){
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
            :deep(.commentContent){
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
        :deep(.quote){
            padding:5px 8px;
            border-bottom:none;
            text-align: left;
            margin-top: 20px;
            .cancelNickname{
                font-weight:normal;
                margin-right: 3px;
                color: transparent;
                text-shadow: 0 0 5px rgba(0,0,0,0.4);
                zoom: 1;
                user-select:none;
            }
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
                background-color: $color-black-25;
            }
            .quoteComment{
                background:$color-black-10;
                padding:5px 8px 8px 8px;
                border:1px solid $color-black-30;
                line-height:140%;
                margin-bottom:6px;
                line-height: 28px;
                border-radius: 3px;
                .userName{
                    font-size:14px;
                    height: 30px;
                    position: relative;
                    margin-left: 26px;
                    color:$color-black-60;
                    .avatarBox{
                        position:absolute;
                        display:inline-block;
                        border-radius:100%;
                        left: -26px;
                        top:-4px;
                        img{
                            border-radius:100%;
                            width: 22px;
                        }
                    }
                }
                .quoteContent{
                    margin-top: 8px;
                    margin-bottom: 2px;
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
                    user-select:none;
                    .icon{
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


    }
    .page{
        padding-top: 30px;
        padding-bottom: 30px;
        display: flex;
        justify-content: flex-end;
        background: #fff;
    }
}


.addCommentModule{
	margin-top:10px;
    .addComment-wrap{
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

/* 评论添加 */
.comment-formModule {
	margin-top:10px;
    .addComment-wrap{
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

/* 评论修改 */
.editComment-formModule {
	margin-top:50px;
	.editComment-wrap{
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

/* 引用评论 */
.quote-formModule {
	margin-top:50px;
	.addQuote-wrap{
        position: relative;
        padding:23px 20px 2px 20px;
        background: $color-black-10;

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
        .head{
            .icon{
                position: absolute;font-size: 50px;top: -38px;left: -42px;color: $color-black-10;
            }
        }
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
.commentReply-formModule {
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
.editCommentReply-formModule {
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


/* 添加回复对方 */
.addCommentReplyFriend-formModule {
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

/* 红包 */
.redEnvelopeModule{
	margin-top: 10px;
	background: #fff;
	box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
    .redEnvelope{
        margin-bottom:10px;
        padding:20px 15px 20px;
        margin:0 auto; 
        width:220px;
        .box {
            border-radius: 16px;
            background-color: #ff483a;
            overflow: hidden;
            position: relative;
            color: #FFFFFF;
            .head {
                border-bottom-right-radius: 100%;
                border-bottom-left-radius: 100%;
                width: 150%;
                border-bottom: 2px solid #e03d19;
                background-image: linear-gradient(-180deg, #ff583f 0%, #ff483a 100%);
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                min-height: 90px;
            }
            .body {
                .content{
                    margin-top:120px;
                    margin-bottom:50px;
                    color:#fed68e;font-size:18px;height: 30px;position: relative;margin-left: 76px;
                    .avatarBox{
                        position:absolute;display:inline-block;border-radius:100%;
                        left: -56px;top:-12px;
                        img{
                            border-radius:100%;
                            width: 48px;
                        }
                    }
                }
            }
            .btn{
                border:none;
                position: absolute;
                top:50px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #fed848;
                width: 70px;
                height: 70px;
                line-height: 70px;
                text-align: center;
                font-size: 40px;
                color:#dc972e;
                border-radius: 100%;
                cursor: pointer;
                transition: transform 0.3s;
                transform-origin:0 50%;
                
                -moz-user-select:none; /*火狐*/
                -webkit-user-select:none; /*webkit浏览器*/
                user-select:none;
                &:hover {
                    transform: scale(1.2) translateX(-50%) ;/* perspective(1px) translate3d(0,0,0) */
                }
            }
            .open-btn{
                border:none;
                position: absolute;
                top:50px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #fed848;
                width: 70px;
                height: 70px;
                line-height: 70px;
                text-align: center;
                font-size: 24px;
                color:#dc972e;
                border-radius: 100%;
                cursor: pointer;
                transition: transform 0.3s;
                transform-origin:0 50%;
            }
        }
    }
    .receiveRedEnvelopeUser{
        margin-left: 25px;padding-bottom: 15px;margin-right: 25px;position: relative;
        .box{
            text-align: center;margin-left: -10px;
        }
        .avatar {
            width: 32px;
            height: 32px;
            line-height: 32px;
            margin-bottom:8px;
            margin-right: -13px !important;
            display: inline-block;
            
            background: #fff no-repeat center/cover;
            position: relative;
            text-align: center;
            color: #fff;
            vertical-align: bottom;

            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border-radius: 50%;
            box-shadow: 0 0 0 1px rgba(0,0,0,.1);
            &:hover {
                margin-right: -4px !important;
                transition-duration:0.3s;
            }
        }
        .more {
            width:20px; height:14px; position: absolute;left: 0; right: 0; bottom: 5px;
            margin: auto;
            .icon {
                font-size: 15px;
                color: $color-black-50;
                &:hover{
                    color: #1890ff;
                }
            }
        }
    }
    .noRedEnvelope{
        margin-bottom:10px;
        padding:20px 15px 20px;
        margin:0 auto;
        width:220px;
        .box {
            border-radius: 16px;
            background-color: #ff483a;
            overflow: hidden;
            position: relative;
            color: #FFFFFF;
            .content{
                color:#fed68e;font-size:16px;height: 60px;line-height:60px; position: relative;text-align: center;
            }
        }
    }
}

/* 相关话题 */
.likeTopicModule{
	margin-top: 10px;
	background: #fff;
	box-shadow: 0 0px 3px 0 rgba(0,0,0,.02), 0 4px 8px 0 rgba(0,0,0,.02);
    .likeTopic{
        margin-bottom:10px;
        padding:0 15px 0;
        .title{
            font-size:18px;
            padding:20px 0 15px;
            color:$color-black-90;
            border-bottom:1px solid $color-black-20;
        }
        .topicList {
            font-size: 15px;
            margin-top: 10px;
            > .topic-title {
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
                    background-color: $color-black-10;
                    text-align: center;
                    border-radius: 4px;
                    flex: none;
                    align-items: center;
                    justify-content: center;
                    color: $color-black-60;
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

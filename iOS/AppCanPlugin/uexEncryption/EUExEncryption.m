//
//  uexEncryption.m
//  File
//
//  Created by 罗啟杰 on 2017/2/7.
//  Copyright © 2017年 Roger. All rights reserved.
//

#import "EUExEncryption.h"
#import "AESCrypt.h"
#import <AppCanKit/ACArguments.h>
#import "LQJCreateFolder.h"

@interface EUExEncryption ()
{
NSString *encryptedData;
}
@end

@implementation EUExEncryption



-(NSString *)savePlacePath{

    NSString *createPath=[LQJCreateFolder createFolderAtDocument:@"savePlace"];
    
    NSString *savePath=[createPath stringByAppendingPathComponent:@"savePlace"];

    return savePath;
}


-(void)onEncrypt:(NSMutableArray *)parameters{


    
    if (parameters.count==0) {

        NSString *code=@"404";
        NSString *data=NULL;
        NSNumber *type=[NSNumber numberWithInt:404];
        
        [self.webViewEngine callbackWithFunctionKeyPath:@"uexEncryption.cbData" arguments:ACArgsPack(code,data,type)];
        return;

        
    }else{
        encryptedData = [AESCrypt encrypt:parameters[1] password:parameters[0]];//加密
        
        NSData* save = [encryptedData dataUsingEncoding:NSUTF8StringEncoding];
        BOOL success=[save writeToFile:[self savePlacePath] atomically:YES];
        NSLog(@"success===%d",success);

        
        
        
        
//        NSString *message = [AESCrypt decrypt:encryptedData password:parameters[0]];
//        NSLog(@"解密结果:%@",message);
    }
    
    
    
    
    
}

-(void)onDecrypt:(NSMutableArray *)parameters{

    if (parameters.count==0) {
        NSString *code=@"404";
        NSString *data=NULL;
        NSNumber *type=[NSNumber numberWithInt:404];
        
        [self.webViewEngine callbackWithFunctionKeyPath:@"uexEncryption.cbData" arguments:ACArgsPack(code,data,type)];
        return;
    }
    NSString *savePlace=[self savePlacePath];

    NSData *get=[NSData dataWithContentsOfFile:savePlace];
    
    encryptedData = [[NSString alloc]initWithData:get encoding:NSUTF8StringEncoding];
    

    NSString *code=@"200";
    NSString *data=[AESCrypt decrypt:encryptedData password:parameters[0]]; //解密
    NSNumber *type=[NSNumber numberWithInt:200];

    
    [NSThread sleepForTimeInterval:0.3];
    
//    [self.webViewEngine callbackWithFunctionKeyPath:@"uexEncryption.cbData" arguments:ACArgsPack(code,type,data)];
    
    [self.webViewEngine callbackWithFunctionKeyPath:@"uexEncryption.cbData" arguments:ACArgsPack(code,type,data) completion:^(JSValue * _Nullable returnValue) {
//        NSLog(@"%@",returnValue);
    }];
    
    
//    回调方法：
//    uexEncryption.cbData
//    
//    回调参数：
//    （code, type, data）
//    当code=404或者type=404时，提示联系人的键或者联系人数据字段为null
//    当code=201或者type=201时，加密成功，并返回加密文件的路径。
//    当code=200或者type=200时，解密成功，并返回文件的内容字段。

}



@end

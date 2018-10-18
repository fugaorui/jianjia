//
//  EUExOffice.m
//  File
//
//  Created by 罗啟杰 on 2017/2/8.
//  Copyright © 2017年 Roger. All rights reserved.
//

#import "EUExOffice.h"
#import "LQJCreateFolder.h"
#import <AppCanKit/ACArguments.h>
#import "AFNetworking.h"
#import "EUtility.h"


@interface EUExOffice ()
{
    NSString *obj;
    
}
@property(nonatomic,strong)UIWebView *checkView;
@property(nonatomic,copy)NSString *pathExtension;


@end


@implementation EUExOffice



-(void)onDownloadDocuments:(NSMutableArray *)paramters{
    NSString *downPath;   //判断文件类型
    self.pathExtension=[[paramters firstObject]pathExtension];
    [[NSUserDefaults standardUserDefaults]setObject:_pathExtension forKey:@"getPathExtension"];
    
    
    if (paramters) {
        for (obj in [NSArray arrayWithObjects:@"word",@"excel",@"ppt",@"pdf",@"wordx", nil]) {
            if ([obj isEqualToString:paramters[2]]) {
                if ([obj isEqualToString:@"word"]||[obj isEqualToString:@"wordx"]) {
                    obj=@"doc";
                    downPath=[LQJCreateFolder getDocumentSubFolderPath:obj];
                    break;
                }else if ([obj isEqualToString:@"excel"]){
                    obj=@"xls";
                    downPath=[LQJCreateFolder getDocumentSubFolderPath:obj];
                    break;
                }else{
                    downPath=[LQJCreateFolder getDocumentSubFolderPath:obj];
                    break;
                }
                
            }
        }
    }
    
    
    NSFileManager *fileMgr=[NSFileManager defaultManager];
    //    downPath=[LQJCreateFolder getDocumentSubFolderPath:@"doc"];//office文件夹(调试用)
    NSString *fileName=[NSString stringWithFormat:@"%@.%@",paramters[1],self.pathExtension];//文件名拼接
    
    
    //    NSString *savePath=[downPath stringByAppendingPathComponent:fileName];//添加文件名
    NSString *path = [downPath stringByAppendingPathComponent:fileName];
    
    AFHTTPSessionManager *afMgr=[AFHTTPSessionManager manager];
    NSURL *url=[NSURL URLWithString:paramters[0]];
    NSURLRequest *request=[NSURLRequest requestWithURL:url];
    NSURLSessionDownloadTask *task=[afMgr downloadTaskWithRequest:request progress:^(NSProgress * _Nonnull downloadProgress) {
        
//        NSLog(@"%f",1.0 *downloadProgress.completedUnitCount / downloadProgress.totalUnitCount);
        
    } destination:^NSURL * _Nonnull(NSURL * _Nonnull targetPath, NSURLResponse * _Nonnull response) {
        
        
        
        return [NSURL fileURLWithPath:path];//返回下载后的目标路径
        
        
    } completionHandler:^(NSURLResponse * _Nonnull response, NSURL * _Nullable filePath, NSError * _Nullable error) {

        
        //回调
        if ([fileMgr fileExistsAtPath:path]) {
            NSNumber *code=[NSNumber numberWithInt:200];
            NSNumber *type=[NSNumber numberWithInt:200];;
            NSString *data=path;
            
            [self.webViewEngine callbackWithFunctionKeyPath:@"uexOffice.cbDocDownload" arguments:ACArgsPack(code,type,data)];
//            self onOpenWord:<#(NSMutableArray *)#>
            
        }else{
            
            
            NSNumber *code=[NSNumber numberWithInt:403];
            NSNumber *type=[NSNumber numberWithInt:403];;
            NSString *data=@"FAIL";
            
            [self.webViewEngine callbackWithFunctionKeyPath:@"uexOffice.cbDocDownload" arguments:ACArgsPack(code,type,data)];
        
        }
        
        
//        NSLog(@"filePath---->%@",path);
        
    }];
    
    
    [task resume];
    
}




//清除缓存
-(void)cleanCache:(NSMutableArray *)paramters{
    NSArray <NSString *>*name=@[@"doc",@"xls",@"ppt",@"pdf",@"savePlace"];
    
    NSFileManager* fm=[NSFileManager defaultManager];
    for (int i=0; i<name.count; i++) {
        
        NSString *delPath= [LQJCreateFolder getDocumentSubFolderPath:name[i]];
        
        [fm removeItemAtPath:delPath error:nil];
        NSLog(@"移除成功");

    }
    

    NSNumber *code=[NSNumber numberWithInt:200];
    NSNumber *type=[NSNumber numberWithInt:200];
    NSString *data=@"ture";
    

    
    
    [self.webViewEngine callbackWithFunctionKeyPath:@"uexOffice.cbClean" arguments:ACArgsPack(code,type,data)];

    
    [self createFolder];
}


-(void)createFolder{
    //    创建文件夹
    NSString *documentPath=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    NSArray <NSString *>*name=@[@"doc",@"xls",@"ppt",@"pdf"];
    
    NSMutableArray *path=[NSMutableArray array];
    NSFileManager* fm=[NSFileManager defaultManager];
    
    
    NSString *createPath=[documentPath stringByAppendingPathComponent:name[1]];
    
    if (![fm fileExistsAtPath:createPath]) {
        for (int i=0; i<name.count; i++) {
            [LQJCreateFolder createFolderAtDocument:name[i]];
            
        }
        for (int j=0; j<name.count; j++) {
            NSArray *files = [fm subpathsAtPath:documentPath];
            NSString *createPath=[documentPath stringByAppendingPathComponent:files[j]];
            
            [path addObject:createPath];
        }
        
        
        NSLog(@"创建成功");
//        NSLog(@"%@",path);
    }


}






@end

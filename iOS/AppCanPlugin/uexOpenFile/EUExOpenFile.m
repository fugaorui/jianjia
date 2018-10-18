//
//  uexOpenFile.m
//  OfficeFile
//
//  Created by 罗啟杰 on 2017/1/22.
//  Copyright © 2017年 Roger. All rights reserved.
//

#import "EUExOpenFile.h"
#import "EUtility.h"
#import "LQJViewController.h"
//#import "OffieceModel.h"

@interface EUExOpenFile ()

@property(nonatomic,strong)UIWebView *checkView;
@end

@implementation EUExOpenFile



-(void)importFilePath:(NSString *)path{
    
    if (!path) {
        return;
    }

    
    LQJViewController *lqjVC=[[LQJViewController alloc]init];
    lqjVC.filePath=path;
    
    
//    [EUtility brwView:self.meBrwView presentModalViewController:lqjVC animated:YES];

    [EUtility  brwView:self.meBrwView navigationPresentModalViewController:lqjVC animated:YES];
    
//    UIViewController *cc=[[UIViewController alloc]init];
//    [cc presentViewController:lqjVC animated:YES completion:nil];
    
}


-(NSString *)getFilePath{
    NSString *documentPath=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    
    
    return documentPath;
    
}



-(void)onOpenWord:(NSMutableArray *)name{
    NSString *pathExtension=[[NSUserDefaults standardUserDefaults]valueForKey:@"getPathExtension"];
    
    NSString *path=[[self getFilePath]stringByAppendingPathComponent:@"doc"];
    NSString *fileName=[NSString stringWithFormat:@"%@.%@",[name firstObject],pathExtension];
    NSString *filePath=[path stringByAppendingPathComponent:fileName];
    [self importFilePath:filePath];
    
}


-(void)onOpenExcel:(NSMutableArray *)name{
    NSString *pathExtension=[[NSUserDefaults standardUserDefaults]valueForKey:@"getPathExtension"];
    
    NSString *path=[[self getFilePath]stringByAppendingPathComponent:@"xls"];
    NSString *fileName=[NSString stringWithFormat:@"%@.%@",[name firstObject],pathExtension];
    
    NSString *filePath=[path stringByAppendingPathComponent:fileName];
    [self importFilePath:filePath];
}

-(void)onOpenPPT:(NSMutableArray *)name{
    NSString *pathExtension=[[NSUserDefaults standardUserDefaults]valueForKey:@"getPathExtension"];
    
    NSString *path=[[self getFilePath]stringByAppendingPathComponent:@"ppt"];
    NSString *fileName=[NSString stringWithFormat:@"%@.%@",[name firstObject],pathExtension];
                        
    NSString *filePath=[path stringByAppendingPathComponent:fileName];
    [self importFilePath:filePath];
}

-(void)onOpenPDF:(NSMutableArray *)name{
    NSString *pathExtension=[[NSUserDefaults standardUserDefaults]valueForKey:@"getPathExtension"];
    
    NSString *path=[[self getFilePath]stringByAppendingPathComponent:@"pdf"];
    NSString *fileName=[NSString stringWithFormat:@"%@.%@",[name firstObject],pathExtension];
    
    NSString *filePath=[path stringByAppendingPathComponent:fileName];
    [self importFilePath:filePath];
}





@end

//
//  LQJCreateFolder.m
//  LQJCreateFolder
//
//  Created by 罗啟杰 on 2016/12/19.
//  Copyright © 2016年 Roger. All rights reserved.
//

#import "LQJCreateFolder.h"

@implementation LQJCreateFolder

+(NSString *)createFolderAtDocument:(NSString *)name{
    NSFileManager *manager=[NSFileManager defaultManager];
    NSString *documentPath=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    
    NSString *createPath=[documentPath stringByAppendingPathComponent:name];
    
    [manager createDirectoryAtPath:createPath withIntermediateDirectories:YES attributes:nil error:nil];
    
    return createPath;
    
}

+(NSString *)createFolderAtCaches:(NSString *)name{
    NSFileManager *manager=[NSFileManager defaultManager];
    NSString *cachesPath=[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
    
    NSString *createPath=[cachesPath stringByAppendingPathComponent:name];
    
    [manager createDirectoryAtPath:createPath withIntermediateDirectories:YES attributes:nil error:nil];
    
    return createPath;

}



+(NSString *)getDocumentSubFolderPath:(NSString *)name{
    NSString *documentPath=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    
    NSString *floderPath=[documentPath stringByAppendingPathComponent:name];
    
    return floderPath;
}

+(NSString *)getCachesSubFolderPath:(NSString *)name{
    NSString *cachesPath=[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
    
    NSString *floderPath=[cachesPath stringByAppendingPathComponent:name];
    
    return floderPath;
}







@end

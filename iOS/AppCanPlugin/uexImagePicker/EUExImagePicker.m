//
//  EUExImagePicker.m
//  TipSoft
//
//  Created by 罗啟杰 on 2017/3/8.
//  Copyright © 2017年 zywx. All rights reserved.
//

#import "EUExImagePicker.h"
@interface EUExImagePicker()
{
    NSString *path;
    NSMutableArray *photoArr;
}
@end

@implementation EUExImagePicker

-(void)pickPhotos:(NSMutableArray *)params{
    
    
    TZImagePickerController *tzC=[[TZImagePickerController alloc]initWithMaxImagesCount:1 delegate:self];
    tzC.allowPickingVideo=NO;
    tzC.allowPickingGif=NO;
    tzC.allowPreview=NO;

    tzC.pickerDelegate=self;
    path=[LQJCreateFolder createFolderAtCaches:@"photos"];
    [tzC setDidFinishPickingPhotosHandle:^(NSArray<UIImage *> *a, NSArray *b, BOOL c) {
        
        
        NSString *getPath=[LQJCreateFolder copyPicture:[a firstObject] toPath:path];
//        NSString *str=[getPath stringByAppendingString:@".jpg"];
        
        [self.webViewEngine callbackWithFunctionKeyPath:@"uexImagePicker.cBphotoPath" arguments:ACArgsPack(nil,nil,getPath)];

    }];

    [EUtility brwView:meBrwView presentModalViewController:tzC animated:YES];

}

-(void)deletePhoto:(NSMutableArray *)params{
    NSString *str=[params firstObject];
    
    NSFileManager *mgr=[NSFileManager defaultManager];
    [mgr removeItemAtPath:str error:nil];
    
}


@end
